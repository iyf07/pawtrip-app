import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.transformPen import TransformPen
F='/Users/ivan/workplace/pawtrip-app/pawtrip/node_modules/@expo-google-fonts/fredoka/700Bold/Fredoka_700Bold.ttf'
font=TTFont(F); gs=font.getGlyphSet(); cmap=font.getBestCmap(); upm=font['head'].unitsPerEm
BROWN='#B8A090'
COL={'trip':'#FEC119','feel':'#EB86A6','bowl':'#F48D4B'}
def gname(c): return cmap[ord(c)]
def contours(name):
    rp=DecomposingRecordingPen(gs); gs[name].draw(rp)
    cs=[];cur=[]
    for op,args in rp.value:
        cur.append((op,args))
        if op in('closePath','endPath'): cs.append(cur);cur=[]
    return cs
def cbounds(c):
    bp=BoundsPen(gs)
    for op,a in c: getattr(bp,op)(*a)
    return bp.bounds
def cpath(c,tx,ty,s):
    sp=SVGPathPen(gs,ntos=lambda v:('%.1f'%v))
    tp=TransformPen(sp,(s,0,0,-s,tx,ty))
    for op,a in c: getattr(tp,op)(*a)
    return sp.getCommands()
def area(b): return (b[2]-b[0])*(b[3]-b[1])
PAW=lambda col,cx,cy,w:(
 f'<g transform="translate({cx:.1f} {cy:.1f}) scale({w/100:.4f})" fill="{col}">'
 '<ellipse cx="-36" cy="-6" rx="9.5" ry="13" transform="rotate(-28 -36 -6)"/>'
 '<ellipse cx="-13" cy="-27" rx="10.5" ry="14.5" transform="rotate(-9 -13 -27)"/>'
 '<ellipse cx="13" cy="-27" rx="10.5" ry="14.5" transform="rotate(9 13 -27)"/>'
 '<ellipse cx="36" cy="-6" rx="9.5" ry="13" transform="rotate(28 36 -6)"/>'
 '<path d="M0 6C20 6 39 24 35 39C31 52 14 47 0 47C-14 47 -31 52 -35 39C-39 24 -20 6 0 6Z"/></g>')
def build(word,special,kind,size=700,tracking=-10):
    s=size/upm; x=0; parts=[]; base=size*1.0
    minx=1e9;maxx=-1e9;miny=1e9;maxy=-1e9
    xh=0
    bp=BoundsPen(gs); gs[gname('x')].draw(bp); xh=bp.bounds[3]*s
    paw_extra=''
    for i,ch in enumerate(word):
        n=gname(ch); adv=font['hmtx'][n][0]*s
        isp=(i==special)
        if isp and kind=='dot':
            lb=BoundsPen(gs); gs[gname('l')].draw(lb); l=lb.bounds; sw=(l[2]-l[0])*s
            x+=40; ix=x+(adv-sw)/2; top=base-xh
            parts.append(f'<rect x="{ix:.1f}" y="{top:.1f}" width="{sw:.1f}" height="{xh:.1f}" rx="{sw/2:.1f}" fill="{COL["trip"]}"/>')
            pw=sw*2.3
            paw_extra=PAW(COL['trip'],ix+sw/2,top-pw*0.70,pw)
            minx=min(minx,ix);maxx=max(maxx,ix+sw);miny=min(miny,top-pw*0.70-pw*0.4);maxy=max(maxy,base)
        else:
            cs=contours(n)
            cs.sort(key=lambda c:-area(cbounds(c)))
            if isp:
                outer=cs[0]; eye=cs[1]; eb=cbounds(eye)
                parts.append(f'<path d="{cpath(outer,x,base,s)}" fill="{COL[kind]}"/>')
                ob=cbounds(outer)
                cx=x+((eb[0]+eb[2])/2)*s; cy=base-((eb[1]+eb[3])/2)*s
                if kind=='feel': pw=(ob[2]-ob[0])*s*0.46; cx=x+((eb[0]+eb[2])/2)*s
                else: pw=(ob[2]-ob[0])*s*0.72; cx=x+(ob[0]+ob[2])/2*s; cy=base-(ob[1]+ob[3])/2*s
                paw_extra+=PAW('#FFFFFF',cx,cy-pw*(0.10 if kind=='bowl' else 0.05),pw)
            else:
                d=' '.join(cpath(c,x,base,s) for c in cs)
                parts.append(f'<path d="{d}" fill="{BROWN}" fill-rule="nonzero"/>')
            b=cbounds(cs[0]); minx=min(minx,x+b[0]*s); maxx=max(maxx,x+b[2]*s); miny=min(miny,base-b[3]*s); maxy=max(maxy,base-b[1]*s)
        x+=adv+tracking+(40 if (isp and kind=='dot') else 0)
    return parts,paw_extra,minx,maxx,(miny,maxy)
for key,(word,sp,kind) in {'trip':('Trip',2,'dot'),'feel':('Feel',2,'feel'),'bowl':('Bowl',1,'bowl')}.items():
    parts,paw,minx,maxx,(miny,maxy)=build(word,sp,kind)
    pad=110; y0=miny-pad; h=(maxy-miny)+2*pad
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{minx-pad:.0f} {y0:.0f} {maxx-minx+2*pad:.0f} {h:.0f}" width="1024" height="{1024*h/(maxx-minx+2*pad):.0f}"><rect x="-5000" y="-5000" width="10000" height="10000" fill="#FFFFFF"/>'+''.join(parts)+paw+'</svg>'
    open(f'/Users/ivan/workplace/pawtrip-app/docs/logo-explore/svg/logo-{key}.svg','w').write(svg)
print('done')

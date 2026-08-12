// Keep the supplied game bundle unchanged. This small loader removes the two
// known desktop stalls before the bundle executes.
const response = await fetch('./assets/index-zjfuxYMU.js');
if (!response.ok) throw new Error(`Unable to load Snowrider (${response.status})`);

let source = await response.text();

const replaceOnce = (from, to, label) => {
  if (!source.includes(from)) throw new Error(`Snowrider performance patch failed: ${label}`);
  source = source.replace(from, to);
};

// The original start-up path bakes the same procedural environment twice.
// Start with no environment and let the existing look setup bake it once.
replaceOnce(
  'let es=Oc(Ne);_t.environment=je.envMap?es:null;',
  'let es=null;_t.environment=null;',
  'environment setup'
);

// Dynamic module loading occurs after the page has cleaned the temporary
// desktop `?q=3` URL pin. Preserve that intended Low default here; explicit
// `?q=` links still take precedence, and mobile still chooses Medium.
replaceOnce(
  'const Dl=new URLSearchParams(location.search),Wc=Dl.has("q")?Number(Dl.get("q")):null,hs=',
  'const Dl=new URLSearchParams(location.search),Wc=Dl.has("q")?Number(Dl.get("q")):3,hs=',
  'desktop default quality'
);

const originalQualitySwitch = String.raw`function $a(i){ri=wt.clamp(i,0,wn.length-1),je=wn[ri],Ne.setPixelRatio(Math.min(window.devicePixelRatio,2)*je.renderScale),Ne.setSize(window.innerWidth,window.innerHeight),rt.shadow.mapSize.set(je.shadowMapSize,je.shadowMapSize),rt.shadow.map?.dispose(),rt.shadow.map=null;const e=Xc(),t=Ne.shadowMap.enabled!==je.shadows||Ne.shadowMap.type!==e;Ne.shadowMap.enabled=je.shadows,Ne.shadowMap.type=e,rt.castShadow=je.shadows,rt.shadow.bias=-6e-4,rt.shadow.normalBias=.4,_t.environment=je.envMap?es:null,t&&_t.traverse(n=>{n.material&&(n.material.needsUpdate=!0)}),vn.dispose(),vn=new Bc(je),_t.add(vn.group),Kc(),$c(),vn.follow(Ue.position),Ya.dispose(),Ya=new kc(Ne,je.deformRes),Pt.dispose(),Pt=new Vc(Ne,_t,ut,je),Pt.flareStrength=si[I.look]?.flare??Pt.flareStrength,Pt.godRayStrength=si[I.look]?.godRays??Pt.godRayStrength,vn.setEnvironmentIntensity(I.envIntensity??.85),Pt.setSize(window.innerWidth,window.innerHeight),Zc(),Jc()}`;

const optimizedQualitySwitch = String.raw`function $a(i){ri=wt.clamp(i,0,wn.length-1),je=wn[ri];if(hs){Ne.setPixelRatio(Math.min(window.devicePixelRatio,2)*je.renderScale),Ne.setSize(window.innerWidth,window.innerHeight),rt.shadow.mapSize.set(je.shadowMapSize,je.shadowMapSize),rt.shadow.map?.dispose(),rt.shadow.map=null;const e=Xc(),t=Ne.shadowMap.enabled!==je.shadows||Ne.shadowMap.type!==e;Ne.shadowMap.enabled=je.shadows,Ne.shadowMap.type=e,rt.castShadow=je.shadows,rt.shadow.bias=-6e-4,rt.shadow.normalBias=.4,_t.environment=je.envMap?es:null,t&&_t.traverse(n=>{n.material&&(n.material.needsUpdate=!0)}),vn.dispose(),vn=new Bc(je),_t.add(vn.group),Kc(),$c(),vn.follow(Ue.position),Ya.dispose(),Ya=new kc(Ne,je.deformRes),Pt.dispose(),Pt=new Vc(Ne,_t,ut,je),Pt.flareStrength=si[I.look]?.flare??Pt.flareStrength,Pt.godRayStrength=si[I.look]?.godRays??Pt.godRayStrength,vn.setEnvironmentIntensity(I.envIntensity??.85),Pt.setSize(window.innerWidth,window.innerHeight),Zc(),Jc();return}Ne.setPixelRatio(Math.min(window.devicePixelRatio,2)*je.renderScale),Ne.setSize(window.innerWidth,window.innerHeight),_t.environment=je.envMap?es:null,Pt.bloom.enabled=je.bloom,Pt.godRays.enabled=je.godRays,Pt.flareStrength=si[I.look]?.flare??Pt.flareStrength,Pt.godRayStrength=si[I.look]?.godRays??Pt.godRayStrength,Pt.setSize(window.innerWidth,window.innerHeight),Zc(),Jc()}`;

// Desktop quality now retains terrain, snow deformation, particles, shadow
// resources and post-processing. It adjusts output scale and enabled effects
// instead of allocating a new world for every setting.
replaceOnce(originalQualitySwitch, optimizedQualitySwitch, 'quality switch');

const originalBoot = String.raw`Ne.compile(_t,ut);Zc();ih();Yc(Gg);Jc();jc();requestAnimationFrame(()=>{document.getElementById("loading")?.classList.add("gone"),document.getElementById("hint")?.classList.add("fade")});`;
const optimizedBoot = String.raw`Yc(Gg);Ne.compileAsync(_t,ut).catch(()=>Ne.compile(_t,ut)).finally(()=>{Zc();ih();Jc();jc();requestAnimationFrame(()=>{document.getElementById("loading")?.classList.add("gone"),document.getElementById("hint")?.classList.add("fade")})});`;

// Compiling shaders asynchronously keeps the loading screen responsive until
// the first render is actually ready.
replaceOnce(originalBoot, optimizedBoot, 'startup compilation');

await import(URL.createObjectURL(new Blob([source], { type: 'text/javascript' })));

function n(){const t=""+Math.round(Math.random()*1e3)+Date.now()+Math.round(Math.random()*1e3);return e(t)}function e(t){const r="0123456789abcdefghijklmnopqrstuvwxyz";let o="";do o=r[t%36]+o,t=Math.floor(t/36);while(t>0);return o}export{n as g};
function s(t,e,r,n){if(!/^[a-zA-Z][a-zA-Z0-9_]+$/.test(e)){r(new Error(n));return}r()}function u(t,e,r,n){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){r(new Error(n));return}r()}function i(t,e,r,n){if(!/^(?!0)(\d+)\.(\d+)\.(\d+)/.test(e)){r(new Error(n));return}r()}export{i as a,s as b,u as c};
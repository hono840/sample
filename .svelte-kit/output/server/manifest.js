export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.DeYMAAuP.js",app:"_app/immutable/entry/app.DG_k_FMs.js",imports:["_app/immutable/entry/start.DeYMAAuP.js","_app/immutable/chunks/CsFq7My9.js","_app/immutable/chunks/CL54CPdI.js","_app/immutable/chunks/CamN6dP1.js","_app/immutable/entry/app.DG_k_FMs.js","_app/immutable/chunks/CL54CPdI.js","_app/immutable/chunks/DWdBeoY0.js","_app/immutable/chunks/CcG9SExS.js","_app/immutable/chunks/CamN6dP1.js","_app/immutable/chunks/BJu5p_3_.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/webstore",
				pattern: /^\/webstore\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

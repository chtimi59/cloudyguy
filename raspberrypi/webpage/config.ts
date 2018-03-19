import * as path from 'path'

export let config: Config = {
	servePath: 'dist',
	verbose: 0,
	logDate: true,

	//TODO need strategy for these @mcclunc, we can build a .env but do we want to handle distribution of it?
	cookieSignSecret: '10AppFrameSecretCookie01',
	webpackServerDomain: "http://localhost:8080",
	loginCallback: "authCallback", /* defined during project creation ? */
	logoutCallback: "logoutCallback", /* defined during project creation ? */
	ressourcePath: path.resolve(`${__dirname}/../../resources`), /* repoTemplate, applications list... */
	authEnvironments: {
		dev: {
			domain: "https://developer-dev.api.autodesk.com",
			accountsDomain: "https://accounts-dev.autodesk.com",
			client_id: (protocol: string, host: string) => {
				if (host.match(/\.autodesk\.com$/)) return process.env.DEV_CLIENT_ID;
				if (host == "localhost:3000" && protocol == "http") return process.env.DEV_CLIENT_ID_LOCAL_HTTP;
				if (host == "localhost:3443" && protocol == "https") return process.env.DEV_CLIENT_ID_LOCAL_HTTPS;
				return null;
			},
			client_secret: (protocol: string, host: string) => {
				if (host.match(/\.autodesk\.com$/)) return process.env.DEV_SECRET;
				if (host == "localhost:3000" && protocol == "http") return process.env.DEV_SECRET_LOCAL_HTTP;
				if (host == "localhost:3443" && protocol == "https") return process.env.DEV_SECRET_LOCAL_HTTPS;
				return null;
			},
			cookieTokenName: "authTokenObj-dev"
		},
		stg: {
			domain: "https://developer-stg.api.autodesk.com",
			accountsDomain: "https://accounts-staging.autodesk.com",
			client_id: (protocol: string, host: string) => {
				if (host.match(/\.autodesk\.com$/)) return process.env.STG_CLIENT_ID;
				if (host == "localhost:3000" && protocol == "http") return process.env.STG_CLIENT_ID_LOCAL_HTTP;
				if (host == "localhost:3443" && protocol == "https") return process.env.STG_CLIENT_ID_LOCAL_HTTPS;
				return null;
			},
			client_secret: (protocol: string, host: string) => {
				if (host.match(/\.autodesk\.com$/)) return process.env.STG_SECRET;
				if (host == "localhost:3000" && protocol == "http") return process.env.STG_SECRET_LOCAL_HTTP;
				if (host == "localhost:3443" && protocol == "https") return process.env.STG_SECRET_LOCAL_HTTPS;
				return null;
			},
			cookieTokenName: "authTokenObj-stg"
		},
		prod: {
			domain: "https://developer.api.autodesk.com",
			accountsDomain: "https://accounts.autodesk.com",
			client_id: (protocol: string, host: string) => {
				if (host.match(/\.autodesk\.com$/)) return process.env.PRD_CLIENT_ID;
				if (host == "localhost:3000" && protocol == "http") return process.env.PRD_CLIENT_ID_LOCAL_HTTP;
				if (host == "localhost:3443" && protocol == "https") return process.env.PRD_CLIENT_ID_LOCAL_HTTPS;
				return null;
			},
			client_secret: (protocol: string, host: string) => {
				if (host.match(/\.autodesk\.com$/)) return process.env.PRD_SECRET;
				if (host == "localhost:3000" && protocol == "http") return process.env.PRD_SECRET_LOCAL_HTTP;
				if (host == "localhost:3443" && protocol == "https") return process.env.PRD_SECRET_LOCAL_HTTPS;
				return null;
			},
			cookieTokenName: "authTokenObj-prod"
		}
	},
	hfdmEnvironments: {
		dev: {
			domain: "https://developer-dev.api.autodesk.com/lynx/v1/pss",
			authEnvironmentType: "dev"
		},
		stable: {
			domain: "https://developer-stg.api.autodesk.com/lynx/stable/v1/pss",
			authEnvironmentType: "stg"
		},
		staging: {
			domain: "https://developer-stg.api.autodesk.com/lynx/v1/pss/",
			authEnvironmentType: "stg"
		},
		prod: {
			domain: "https://developer.api.autodesk.com/lynx/v1/pss",
			authEnvironmentType: "prod"
		}
	}
};

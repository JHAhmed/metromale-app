// // src/hooks.server.ts
// import { sessionHooks } from "@kinde-oss/kinde-auth-sveltekit"; 

// export const handle = async ({ event, resolve }) => {
// 	sessionHooks({ event });
// 	const response = await resolve(event);
// 	return response;
// };

// export const handle = async ({ event, resolve }) => {

//     try {
//         event.locals.isAuthenticated = await kindeAuthClient.isAuthenticated(event.request);
//         if (event.locals.isAuthenticated) {
//             event.locals.user = await kindeAuthClient.getUser(event.request);
//         } else {
//             event.locals.user = null;
//         }
//     } catch (error) {
//         console.error("Error in handle hook:", error);
//         event.locals.isAuthenticated = false;
//         event.locals.user = null;
//     }

//     return resolve(event);
// };
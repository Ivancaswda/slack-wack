import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    isAuthenticatedNextjs,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublic = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    if (!isPublic(request) && !(await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/auth");
    }

    if (isPublic(request) && (await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/");
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

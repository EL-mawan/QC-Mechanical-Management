(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__ab6ba0d9._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Gambar/PROJECT ARWAN/QC Mechanical Management Plan2/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Gambar$2f$PROJECT__ARWAN$2f$QC__Mechanical__Management__Plan2$2f$node_modules$2f$next$2d$auth$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Gambar/PROJECT ARWAN/QC Mechanical Management Plan2/node_modules/next-auth/middleware.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Gambar$2f$PROJECT__ARWAN$2f$QC__Mechanical__Management__Plan2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Gambar/PROJECT ARWAN/QC Mechanical Management Plan2/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Gambar$2f$PROJECT__ARWAN$2f$QC__Mechanical__Management__Plan2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Gambar/PROJECT ARWAN/QC Mechanical Management Plan2/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Gambar$2f$PROJECT__ARWAN$2f$QC__Mechanical__Management__Plan2$2f$node_modules$2f$next$2d$auth$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["withAuth"])(function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    // Example of role-based protection
    if (path.startsWith("/admin") && token?.role !== "Admin") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Gambar$2f$PROJECT__ARWAN$2f$QC__Mechanical__Management__Plan2$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", req.url));
    }
}, {
    callbacks: {
        authorized: ({ token })=>!!token
    }
});
const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/projects/:path*",
        "/inspections/:path*"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__ab6ba0d9._.js.map
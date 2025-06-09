async function onRequestGet(context){
    var cookie = context.request.headers.get("Cookie");
    if (!cookie) {
        return Response.redirect(`${context.request.url}signup/`, 302);
    }
    const cookie_check = await context.env.DB.prepare("SELECT * FROM users WHERE ? IN (SELECT value FROM json_each(cookie))").bind(await hash(cookie)).raw();
    if (!cookie_check.length) {
        return Response.redirect(`${context.request.url}signup/`, 302);
    }
    return await context.env.ASSETS.fetch(context.request.url);
}

async function onRequestPost(context) {
    var id = await new Request(context.request).json();
    if (typeof(id) !== "number") {
        return new Response("", {status: 400, statusText: "Bad Request"});
    }
    if (!await context.env.DB.prepare("SELECT * FROM perfumes WHERE id = ?").bind(id).first()) {
        return new Response("", {status: 422, statusText: "Unprocessable Content"});
    }
    var cookie = context.request.headers.get("Cookie");
    if (!cookie) {
        return Response.redirect(`${context.request.url}signup/`, 302);
    }
    const cookie_check = await context.env.DB.prepare("SELECT * FROM users WHERE ? IN (SELECT value FROM json_each(cookie))").bind(await hash(cookie)).first();
    if (!cookie_check) {
        return Response.redirect(`${context.request.url}signup/`, 302);
    }
    var user_cart = await context.env.DB.prepare("SELECT cart FROM users WHERE ? IN (SELECT value FROM json_each(cookie))").bind(await hash(cookie)).first();
    if (user_cart["cart"].hasOwnProperty(id)) {
        var patch = {};
    }
    else {
        context.env.DB.prepare('UPDATE users SET cart = json_patch(cart, {op: "add", path: "/?", value: "1"}) WHERE ? IN (SELECT value FROM json_each(cookie))').bind(id, cookie)
    }
    return new Response("", {status: 200, statusText: "OK"});
}

async function hash(string) {
    var encoder = new TextEncoder();
    var hash_bytes = await crypto.subtle.digest({name: "SHA-512"}, encoder.encode(string));
    var hash_hex = new Uint8Array(hash_bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return hash_hex;
}
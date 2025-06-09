export async function onRequestPost(context) {
    var user_data = await new Request(context.request).json();
    if (!user_data) {
        return new Response("invalid request", {status: 400, statusText: "Bad Request"});
    }
    if (!user_data["email"]) {
        return new Response("invalid request", {status: 400, statusText: "Bad Request"});
    }
    var account = await context.env.DB.prepare("SELECT * FROM users WHERE email = ? AND phonenumber = ? AND password = ?").bind(user_data["email"] || null, user_data["phonenumber"] || null, await hash(user_data["password"])).first();
    if (!account) {
        return new Response("wrong email, phonenumber or password", {status: 400, statusText: "Bad Request"});
    }
    do {
        var cookie = `account=${generatecookie()}`;
        var cookie_check = await context.env.DB.prepare("SELECT * FROM users WHERE ? IN (SELECT value FROM json_each(cookie))").bind(await hash(cookie)).first();
    } while (cookie_check)
    await await context.env.DB.prepare("UPDATE users SET cookie = json_insert(cookie, '$[#]', ?) WHERE email = ? AND phonenumber = ? AND password = ?").bind(await hash(cookie), user_data["email"] || null, user_data["phonenumber"] || null, await hash(user_data["password"])).run();
    return new Response("", {status: 302, statusText: "Found", headers: {"Set-Cookie": `${cookie}; Path=/; SameSite=Strict`, Location: "/"}});
}

function generatecookie() {
    var cookie = crypto.randomUUID();
    for (var i = 0; i > 10; i++) {
        cookie = cookie + crypto.randomUUID();
    }
    return cookie;
}

async function hash(string) {
    var encoder = new TextEncoder();
    var hash_bytes = await crypto.subtle.digest({name: "SHA-512"}, encoder.encode(string));
    var hash_hex = new Uint8Array(hash_bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return hash_hex;
}
export async function onRequestPost(context) {
    var user_data = await new Request(context.request).json();
    if (!user_data) {
        return new Response("invalid request", {status: 400, statusText: "Bad Request"});
    }
    if (!user_data["phonenumber"] && !user_data["email"]) {
        return new Response("provide email or phone number", {status: 400, statusText: "Bad Request"});
    }
    var email_check = await context.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(user_data["email"]).first()
    if (email_check) {
        return new Response("email already in use", {status: 400, statusText: "Bad Request"});
    }
    var phonenumber_check = await context.env.DB.prepare("SELECT * FROM users WHERE phonenumber = ?").bind(user_data["phonenumber"]).first();
    if (phonenumber_check) {
        return new Response("phone number already in use", {status: 400, statusText: "Bad Request"});
    }
    if (!user_data["password"]) {
        return new Response("no password provided", {status: 400, statusText: "Bad Request"});
    }
    if (user_data["password"].length < 8) {
        return new Response("password too short", {status: 400, statusText: "Bad Request"});
    }
        do {
        var cookie = `account=${generatecookie()}`;
        var cookie_check = await context.env.DB.prepare("SELECT * FROM users WHERE ? IN (SELECT value FROM json_each(cookie))").bind(await hash(cookie)).first();
    } while (cookie_check)
    await context.env.DB.prepare("INSERT INTO users VALUES (json_array(?), ?, ?, ?, ?, ?)").bind(await hash(cookie), user_data["email"] || null, user_data["phonenumber"] || null, await hash(user_data["password"]),  user_data["location"] || null, "{}").run();
    return new Response("", {status: 302, statusText: "Moved", headers: {"Set-Cookie": `${cookie}; Path=/; SameSite=Strict`, "Location": "/"}});
}

function generatecookie() {
    var cookie = crypto.randomUUID();
    for (var i = 0; i > 10; i++) {
        cookie = cookie.concat(crypto.randomUUID());
    }
    return cookie;
}

async function hash(string) {
    var encoder = new TextEncoder();
    var hash_bytes = await crypto.subtle.digest({name: "SHA-512"}, encoder.encode(string));
    var hash_hex = new Uint8Array(hash_bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return hash_hex;
}
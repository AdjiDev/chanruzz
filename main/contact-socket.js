const PhoneNumber = require("awesome-phonenumber");

/**
 * Handler contact info
 * @param {*} sock socket 
 * @param {*} store store
 */
async function ContactHandler(sock, store) {

    // contact update
    sock.ev.on("contacts.update", (update) => {
        for (let contact of update) {
            let id = sock.decodeJid(contact.id);
            if (store && store.contacts)
                store.contacts[id] = {
                    id,
                    name: contact.notify,
                };
        }
    });

    sock.getName = (jid, withoutContact = false) => {
        id = sock.decodeJid(jid);
        withoutContact = sock.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us"))
            return new Promise(async (resolve) => {
                v = store.contacts[id] || {};
                if (!(v.name || v.subject)) v = sock.groupMetadata(id) || {};
                resolve(
                    v.name ||
                    v.subject ||
                    PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
                        "international"
                    )
                );
            });
        else
            v =
                id === "0@s.whatsapp.net"
                    ? {
                        id,
                        name: "WhatsApp",
                    }
                    : id === sock.decodeJid(sock.user.id)
                        ? sock.user
                        : store.contacts[id] || {};
        return (
            (withoutContact ? "" : v.name) ||
            v.subject ||
            v.verifiedName ||
            PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
                "international"
            )
        );
    };
}

module.exports = {
    ContactHandler
}
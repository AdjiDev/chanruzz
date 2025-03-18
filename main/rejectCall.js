exports.rejectCall = async (sock) => {
    sock.ev.on("call", async (data) => {
        if (data[0].status === "ringing") {
            if (data[0].processed) {
                return; 
            }

            data[0].processed = true; 

            const interactiveButtons = [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Our Sites",
                        url: "https://www.adjisandev.tech"
                    })
                }
            ];

            const interactiveMessage = {
                text: "sorry, We can't receive calls right now",
                title: "",
                footer: "",
                interactiveButtons
            };

            await sock.rejectCall(data[0].id, data[0].from); 
            await sock.sendMessage(data[0].from, interactiveMessage); 

            console.log(`Panggilan dari ${data[0].from} ditolak dan pesan dikirim.`);
        }
    });
};

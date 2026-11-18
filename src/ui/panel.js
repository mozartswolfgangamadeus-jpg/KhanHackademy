export class MathPanel {
    static create() {
        if (document.getElementById("khanvision-panel")) return;

        const panel = document.createElement("div");
        panel.id = "khanvision-panel";

        Object.assign(panel.style, {
            position: "fixed",
            right: "16px",
            bottom: "20px",
            width: "280px",
            zIndex: "2147483647",
            background: "#151923",
            color: "white",
            padding: "16px",
            borderRadius: "14px",
            fontFamily: "system-ui",
            boxShadow: "0 8px 35px #0008"
        });

        const heading = document.createElement("strong");
        heading.textContent = "KhanVision";

        const close = document.createElement("button");
        close.textContent = "×";
        close.style.cssFloat = "right";
        close.onclick = () => panel.remove();

        const content = document.createElement("div");
        content.id = "kv-content";
        content.textContent = "Đang chờ nội dung toán học...";

        panel.append(heading, close, document.createElement("hr"), content);
        document.body.appendChild(panel);
    }

    static update(text) {
        const content = document.getElementById("kv-content");
        if (content) content.textContent = text;
    }
}

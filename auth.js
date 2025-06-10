document.addEventListener('DOMContentLoaded', function() {
  const users = { 
    'androiduser': 'applebetter', 
    'appleuser': 'applebest' 
  };

  const storedUser = localStorage.getItem('rememberedUser');
  const storedPass = localStorage.getItem('rememberedPass');
  
  if (storedUser && storedPass && users[storedUser] === storedPass) {
    return;
  }

  const authDiv = document.createElement("div");
  authDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(255 255 255);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  authDiv.innerHTML = `
    <div style="
      background: white;
      padding: 20px;
      border-radius: 5px;
      width: 300px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    ">
      <h3 style="margin-top: 0;">Login Required</h3>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Username:</label>
        <input type="text" id="authUser" style="width: 100%; padding: 8px; box-sizing: border-box;" value="${storedUser || ''}">
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Password:</label>
        <input type="password" id="authPass" style="width: 100%; padding: 8px; box-sizing: border-box;" value="${storedPass || ''}">
      </div>
      <div style="margin-bottom: 15px; display: flex; align-items: center;">
        <input type="checkbox" id="rememberMe" style="margin-right: 8px;">
        <label for="rememberMe" style="cursor: pointer;">Remember me</label>
      </div>
      <button id="authBtn" style="
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
      ">Login</button>
      <p id="authError" style="color: red; height: 20px; margin: 10px 0 0;"></p>
    </div>
  `;

  document.body.appendChild(authDiv);
  document.body.style.overflow = "hidden";
  
  if (storedUser) {
    document.getElementById("authPass").focus();
  } else {
    document.getElementById("authUser").focus();
  }

  document.getElementById("authBtn").addEventListener("click", function() {
    const user = document.getElementById("authUser").value;
    const pass = document.getElementById("authPass").value;
    const rememberMe = document.getElementById("rememberMe").checked;
    
    if (users[user] === pass) {
      if (rememberMe) {
        localStorage.setItem('rememberedUser', user);
        localStorage.setItem('rememberedPass', pass);
      } else {
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('rememberedPass');
      }
      
      document.body.removeChild(authDiv);
      document.body.style.overflow = "";
    } else {
      document.getElementById("authError").textContent = "Invalid username or password";
      document.getElementById("authPass").value = "";
      document.getElementById("authPass").focus();
    }
  });

  document.getElementById("authPass").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      document.getElementById("authBtn").click();
    }
  });
});

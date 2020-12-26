customElements.define(
    tagName(),
    class extends HTMLElement {
        escapeHtml(unsafe) {
            return (unsafe + "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        connectedCallback() {
            this.innerHTML = `
                <header>
                  <!-- Navbar -->
                  <section class="navbar">
                    <div class="content">
                      <a href="index.html" class="logotype"></a>
                      <span class="version caption blue ml16">v 2.0</span>
                      <!-- Navigation -->
                      <nav class="nav-header">
                        <a href="#" class="mr32" target="_blank" rel="nofollow">Blog</a>
                        <a href="mailto:hey@counter.dev" class="mr32" target="_blank" rel="nofollow">Feedback</a>
                        <a href="//flattr.com/@ihucos" class="mr32" target="_blank" rel="nofollow">Donate</a>
                        <a
                          href="#"
                          class="github-blue mr16"
                          target="_blank"
                          rel="nofollow"
                        ></a>
                        <a
                          href="#"
                          class="twitter-blue mr32"
                          target="_blank"
                          rel="nofollow"
                        ></a>
                        ${
                            window.username === null
                                ? `
                        <span class="profile-guest">
                          <a href="#" class="ml32 mr32">Sign in</a>
                          <a href="#" class="btn-primary">Sign up</a>
                        </span>`
                                : `
                        <div class="dropdown">
                          <div class="profile-user">${this.escapeHtml(
                              username
                          )}</div>
                          <div class="dropdown-content">
                            <a href="#modal-account" rel="modal:open">Edit account</a>
                            <a href="/logout">Sign out</a>
                          </div>
                        </div>
                        `
                        }
                        <!-- /// -->
                      </nav>
                      <!-- Hamburger -->
                      <div class="hamburger-menu">
                        <input id="hamburger-toggle" type="checkbox" />
                        <label class="hamburger-btn" for="hamburger-toggle"></label>
                        <div class="hamburger-box">
                          <div class="hamburger-content">
                            <img src="img/avatar.svg" width="96" height="96" alt="Avatar" />
                            <!-- Navigation -->
                            <nav class="nav-header-mob">
                              <!-- Guest -->
                              <span class="mt48 mb48" style="display: none">
                                <a href="#" class="btn-primary mr16">Sign in</a>
                                <a href="#" class="btn-secondary">Sign up</a>
                              </span>
                              <!-- User -->
                              <span class="mt24">slomchinskiy</span>
                              <span class="mt24 mb48">
                                <a
                                  href="#modal-account"
                                  class="btn-primary mr16"
                                  rel="modal:open"
                                  onClick="document.getElementById('hamburger-toggle').checked=false"
                                  >Edit account</a
                                >
                                <a href="#" class="btn-secondary">Sign out</a>
                              </span>
                              <!-- /// -->
                              <a href="#" class="mb24" target="_blank" rel="nofollow"
                                >Blog</a
                              >
                              <a href="#" class="mb24" target="_blank" rel="nofollow"
                                >Feedback</a
                              >
                              <a href="#" target="_blank" rel="nofollow">Donate</a>
                              <span class="mt48">
                                <a
                                  href="#"
                                  class="github-blue mr24"
                                  target="_blank"
                                  rel="nofollow"
                                ></a>
                                <a
                                  href="#"
                                  class="twitter-blue"
                                  target="_blank"
                                  rel="nofollow"
                                ></a>
                              </span>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </header>


                <!-- Edit account modal -->
                <div id="modal-account" style="display: none">
                  <div class="modal-header">
                    <img src="img/account.svg" width="24" height="24" alt="Edit account" />
                    <h3 class="ml16">Edit account</h3>
                    <a href="#" class="btn-close" rel="modal:close"></a>
                  </div>
                  <div class="modal-content">
                    <!-- Time zone -->
                    <div class="title mb16">Time zone</div>
                    <select class="width-full">
                      <option>(GMT-03:00) Buenos Aires, Georgetown</option>
                      <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                    </select>
                    <!-- Change password -->
                    <div class="title mb8 mt24">Change password</div>
                    <label class="old-pass width-full"
                      >Old password<input
                        class="width-full"
                        type="password"
                        placeholder="Old password"
                    /></label>
                    <div class="new-pass flex mb8 mt16">
                      <label class="width-half mr16"
                        >New password<input
                          class="width-full"
                          type="password"
                          placeholder="New password"
                      /></label>
                      <label class="width-half"
                        >Repeat new password<input
                          class="width-full"
                          type="password"
                          placeholder="Repeat new password"
                      /></label>
                    </div>
                    <span class="caption gray">The password cannot be recovered!</span>
                    <div class="account-btn-group flex mt24 mb32">
                      <a href="#" class="btn-secondary full mr16" rel="modal:close"
                        >Cancel</a
                      >
                      <button class="btn-primary full">Save</button>
                    </div>
                    <!-- Danger -->
                    <div class="delete-account">
                      <div class="title mb16">Account deleting</div>
                      <div class="danger gradient-red radius-lg">
                        <!-- Request delete -->
                        <div class="delete-request">
                          <div class="danger-message caption full mr16">
                            <img src="img/alert.svg" width="24" height="24" alt="Alert" />
                            <span class="ml16"
                              >Deleting your account removes all sites and stats you've
                              collected!</span
                            >
                          </div>
                          <button class="btn-white btn-danger btn-confirm">
                            Delete account
                          </button>
                        </div>
                        <!-- Confirm delete -->
                        <div class="delete-confirm" style="display: none">
                          <input
                            type="text"
                            class="confirm-input full mr16"
                            placeholder="Enter username to confirm"
                          />
                          <button class="btn-white btn-danger">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                `;

            $('a[rel="modal:open"]', this).click(function (event) {
                $(this).modal({
                    fadeDuration: 200,
                    fadeDelay: 0,
                });
                return false;
            });
        }
    }
);

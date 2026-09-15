<?php ndses_render_hero('make-a-payment'); ?>
<section class="section">
    <div class="container payment-grid">
        <form class="site-form" data-payengine-form novalidate>
            <h2>Payment Form</h2>
            <fieldset class="payment-methods">
                <legend>Payment method</legend>
                <label class="check-row"><input type="radio" name="paymentMethod" value="card" checked> Card payment</label>
                <label class="check-row"><input type="radio" name="paymentMethod" value="ach"> ACH bank payment</label>
            </fieldset>
            <label>Account number <input required minlength="3" type="text" name="accountNumber"></label>
            <label>Payment amount <input required type="text" inputmode="decimal" pattern="^\d+(\.\d{1,2})?$" name="amount"></label>
            <label>Receipt email <input required type="email" name="email"></label>

            <div data-payment-fields="card">
                <label>Name on card <div id="pe-card-name" class="secure-field"></div></label>
                <label>Card number <div id="pe-card-number" class="secure-field"></div></label>
                <div class="two-column-list">
                    <label>Expiration <div id="pe-card-expiry" class="secure-field"></div></label>
                    <label>CVC <div id="pe-card-cvc" class="secure-field"></div></label>
                </div>
                <label>Billing ZIP <div id="pe-card-zip" class="secure-field"></div></label>
            </div>

            <div data-payment-fields="ach" hidden>
                <div class="two-column-list">
                    <label>First name <div id="pe-ach-first-name" class="secure-field"></div></label>
                    <label>Last name <div id="pe-ach-last-name" class="secure-field"></div></label>
                </div>
                <label>Routing number <div id="pe-routing-number" class="secure-field"></div></label>
                <label>Bank account number <div id="pe-account-number" class="secure-field"></div></label>
            </div>

            <p class="form-status" role="status"></p>
            <p class="small-note">Card and bank details are entered directly into PayEngine's secure fields and never touch NDS's servers.</p>
            <button class="button button-primary" type="submit">Submit Payment</button>
        </form>
        <aside class="quote-panel">
            <h2>ACH Bank Payment</h2>
            <p>Pay directly from a checking or savings account using PayEngine's secure bank-transfer flow.</p>
            <p class="small-note">Card payments may include a 3% fee where applicable.</p>
        </aside>
    </div>
</section>


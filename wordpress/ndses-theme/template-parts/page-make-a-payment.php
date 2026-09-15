<?php ndses_render_hero('make-a-payment'); ?>
<section class="section">
    <div class="container payment-grid">
        <form class="site-form" data-payment-placeholder>
            <h2>Payment Form</h2>
            <label>Customer or account name <input required type="text" name="account"></label>
            <label>Invoice number <input type="text" name="invoice"></label>
            <label>Payment amount <input required type="number" min="1" step="0.01" name="amount"></label>
            <label>Payment method
                <select required name="method">
                    <option>Card payment</option>
                    <option>ACH bank payment</option>
                </select>
            </label>
            <p class="small-note">Online payment is being finalized with our payment processor. Please call our office to pay by phone in the meantime.</p>
            <button class="button button-primary" type="submit">Continue Securely</button>
        </form>
        <aside class="quote-panel">
            <h2>ACH Bank Payment</h2>
            <p>Pay directly from a checking or savings account. Bank details are collected securely by our payment processor once online payment is live.</p>
            <p class="small-note">Card payments may include a 3% fee where applicable.</p>
        </aside>
    </div>
</section>


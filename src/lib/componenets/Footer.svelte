<script>
  import CookieBanner from "./CookieBanner.svelte";
  import { MapPin, Mail, Phone } from "lucide-svelte";
</script>

<div class="footer">
  <CookieBanner />

  <div class="footer-content">
    <div class="footer-section">
      <h4>Contact</h4>
      <p class="contact-info">
        <span>
          <a
            href="https://www.ingegneria.unicampania.it/"
            style="color: #fff; text-decoration: underline;"
          >
            Dipartimento di Ingegneria
          </a><br />
          Università della Campania Luigi Vanvitelli<br />
          Via Roma 29, Real Casa dell’Annunziata, Aversa 81031
        </span>
      </p>
      <p class="contact-info">
        <span class="icon-text"><Mail size="24" /></span>
        <span>dip.ingegneria@unicampania.it</span>
      </p>
      <p class="contact-info">
        <span class="icon-text"><Phone size="24" /></span>
        <span>081 5010401</span>
      </p>
    </div>

    <div class="footer-section">
      <h4>Privacy Policy</h4>
      <p>
        <a href="/legal/privacy-policy" style="color: #fff;">Privacy Policy</a>
      </p>
    </div>
  </div>
</div>

<style>
  .footer {
    background-color: #333;
    color: #fff;
    padding: 40px 0;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-content {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    max-width: 1200px;
    width: 100%;
    margin-top: 20px;
  }

  .footer-section {
    max-width: 300px;
  }

  .footer-section h4 {
    margin-bottom: 15px;
  }

  .footer-section p {
    margin: 5px 0;
  }

  .contact-info {
    display: flex;
    align-items: center;
  }

  .icon-text {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
</style>

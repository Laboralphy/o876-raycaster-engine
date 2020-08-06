<template>
  <div>
    <div class="row">
      <div class="col lg-12">
        <h3>Register a new account</h3>
      </div>
    </div>
    <div class="row">
      <div class="col lg-12">
        <p>By registering here, you'll have access to a free use of the Raycasting Map Editor. And that's pretty much all.</p>
        <p>Some pieces of advice, before you register...</p>
        <ul>
          <li>Use an original password.</li>
          <li>Don't lose your password ! There is no way to recover a lost password. Passwords are stored in hashed version on the server.</li>
          <li>If you lose your password, create a new account and ask for a level transfer.</li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col lg-6 lg-offset-3 sm-8 sm-offset-2 xs-10 xs-offset-1">
        <UserPassForm
            action="user"
            action-caption="Create account"
        ></UserPassForm>
      </div>
    </div>
    <div class="row">
      <div class="col lg-12">
        <p>Some other pieces of information...</p>
        <ul>
          <li>Inactive accounts will be deleted if server storage resources run low (this should not happen often).</li>
          <li>The registration process is overly simplified (no password recovery, no confirmation by mail)
            so you may enjoy the use of the Map Editor software immediatly.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import storeMixin from '../mixins/store';
import UserPassForm from "./UserPassForm.vue";

export default {
  name: "CreateUserPage",
  components: {UserPassForm},
  mixins: [storeMixin],
}
</script>

<style scoped>
  ul.form {
    margin: 0;
    padding: 0;
  }

  ul.form > li {
    list-style-type: none;
    margin-top: 2em;
  }
  ul.form > li > label > span {
    font-weight: bold;
  }

  ul.form > li > label > input {
    width: 100%;
  }
</style>
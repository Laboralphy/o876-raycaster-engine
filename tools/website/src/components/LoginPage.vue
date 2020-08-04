<template>
  <div>
    <div class="row">
      <div class="col lg-12">
        <h3>The login page</h3>
      </div>
    </div>
    <div class="row" v-if="!isUserAuthenticated">
      <div class="col lg-12">
        <p>Let's log in !</p>
      </div>
    </div>
    <div class="row" v-if="!isUserAuthenticated">
      <div class="col lg-6 lg-offset-3 sm-8 sm-offset-2 xs-10 xs-offset-1">
        <form method="post" action="/login">
          <ul class="form">
            <li><label><span>Username :</span><br/><input name="username" type="text" /></label></li>
            <li><label><span>Password :</span><br/><input name="password" type="password" /></label></li>
            <li><button class="green" type="submit">Sign in</button></li>
          </ul>
        </form>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col lg-12">
        <p>Let's log out !</p>
        <form method="get" action="/logout">
          <button class="red" type="submit">Log out</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import storeMixin from '../mixins/store';

export default {
  name: "LoginPage",
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
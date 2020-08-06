<template>
  <div>
    <div class="row">
      <div class="col lg-12">
        <h3 v-if="isUserAuthenticated">User profile : {{ getUserDisplayData.name }}</h3>
        <h3 v-else>Sign in</h3>
      </div>
    </div>
    <div class="row" v-if="!isUserAuthenticated">
      <div class="col lg-6 lg-offset-3 sm-8 sm-offset-2 xs-10 xs-offset-1">
        <p>Enter your login/password to get access to your own level design workspace.
          If you don't have an account hit the <span class="button-text">Register</span> button. </p>
        <p class="note">Identifying users has no purpose other than storing level maps into different folders,
          so users have their own workspace to store their level maps without fear of someone deleting their stuff.</p>
      </div>
    </div>
    <div class="row" v-if="!isUserAuthenticated">
      <div class="col lg-6 lg-offset-3 sm-8 sm-offset-2 xs-10 xs-offset-1">
        <UserPassForm
            action="login"
            action-caption="Sign in"
            alt-action="createuser"
            alt-action-caption="Register"
        ></UserPassForm>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col lg-12">
        <p>Account created on : {{ getUserDisplayData.date }}.</p>
        <form method="get" action="/logout">
          <button class="red" type="submit">Log out</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import storeMixin from '../mixins/store';
import UserPassForm from "./UserPassForm.vue";

export default {
  name: "LoginPage",
  components: {UserPassForm},
  mixins: [storeMixin],
}
</script>

<style scoped>
</style>
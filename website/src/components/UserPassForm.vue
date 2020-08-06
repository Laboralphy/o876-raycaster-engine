<template>
  <form method="post" :action="'/' + action">
    <ul class="form">
      <li><label><span>Username :</span><br/><input name="username" type="text" /></label></li>
      <li><label><span>Password :</span><br/><input name="password" type="password" /></label></li>
      <li>
        <div class="row">
          <div class="col lg-6">
            <button class="green">{{ actionCaption }}</button>
          </div>
          <div class="col lg-6" v-if="altAction.length > 0">
            <button @click="$router.push('/' + altAction)" style="position: absolute; right: 1.3em">{{ altActionCaption }}</button>
          </div>
        </div>
      </li>
    </ul>
  </form>
</template>

<script>
export default {
  name: "UserPassForm",
  props: {
    action: {
      type: String,
      require: true
    },
    actionCaption: {
      type: String,
      require: false,
      default: 'Submit'
    },
    altAction: {
      type: String,
      require: false,
      default: ''
    },
    altActionCaption: {
      type: String,
      require: false,
      default: ''
    }
  }
}
</script>

<style scoped>

form {
  border: solid thin #777;
  border-radius: 0.5em;
  padding: 1em;
  box-shadow: 0 0 0.8em rgba(0, 0, 0, 0.4);
}

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
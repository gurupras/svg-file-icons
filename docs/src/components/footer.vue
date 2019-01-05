<template>
  <footer class="page-footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col s12">
          <div class="right" style="margin-right: 2em">
            commit <a target="_blank" :href="'https://github.com/gurupras/svg-file-icons/tree/' + commit"> {{ commit.substr(0, 6) }}</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      commit: __COMMIT_HASH__
    }
  }
}
</script>

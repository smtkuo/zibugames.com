module.exports = function(options={}) {
    this.get = {
        meta:{title:"Game Platform",description:"Games"},
        data:{
            env: process.env,
        },
        p:options
    }
}
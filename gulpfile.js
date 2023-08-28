import webserver from 'gulp-webserver'
import fs from 'fs-extra'
import clean from 'gulp-clean'
import pkg from 'gulp'
const {src} = pkg

const simplify=async function(){
  let npm=await fs.readJSON('package.json')
  let serve=await fs.readJSON('serve.json')
  let readme=await fs.readFile('readme.md','utf8')
  /* change package.json */
  delProp(serve,npm)
  function delProp(obj,target){
    for(let i in obj){
      let item=obj[i]
      if(Array.isArray(item)&&target[i]){
        for(let child of item){
          let index=target[i].findIndex(str=>str===child)
          if(index!==-1)target[i].splice(index,1)
        }
      }else if(typeof(item)==='object'&&target[i]&&item!==null){
        delProp(item,target[i])
      }else{
        Reflect.deleteProperty(target,i)
      }
    }
  }
  /* update version */
  npm.version=updateVersion(npm.version)
  function updateVersion(str){
    let arr=str.split(".").map(item=>Number(item))
    let thr=arr[2]+1
    if(thr>=100){
      let two=arr[1]+1
      if(two>=100){
        arr[0]=arr[0]+1
        arr[1]=arr[2]=0
      }else{
        arr[1]=two
        arr[2]=0
      }
    }else{
      arr[2]=thr
    }
    return arr.join(".")
  }
  console.log(readme)
  /* update readme.md */
  readme=readme.replace(/\/simulate@\d+\.\d+\.\d+\//g,`/simulate@${npm.version}/`)
  await fs.writeJSON('package.json',npm,{spaces:2})
  await fs.writeFile('readme.md',readme)
}

const clear = function() {
  return src(["dist/es/*","dist/umd/*","index.d.ts"],{
    read: false,
    allowEmpty: true
  }).pipe(clean())
}

const dev=async function(){
  const npm=await fs.readJSON('package.json')
  const serve=await fs.readJSON('serve.json')
  addProp(serve,npm)
  function addProp(obj,target){
    for(let i in obj){
      let item=obj[i]
      if(Array.isArray(item)&&target[i]){
        target[i]=target[i].concat(item)
      }else if(typeof(item)==='object'&&target[i]&&item!==null){
        addProp(item,target[i])
      }else{
        target[i]=item
      }
    }
  }
  await fs.writeJSON('package.json',npm,{spaces:2})
}

const serve=function(){
  return src('./').pipe(webserver({
    host:'127.0.0.1',
    port:'5000',
    livereload:true,
    open:'public/index.html'
  }))
}
export {
  serve,simplify,dev,clear
}
import {spawnSync} from 'node:child_process';
export function browser(code,session=process.env.SOURCE_BROWSER_SESSION||'usfans-source') {
 const cli=process.env.PLAYWRIGHT_CLI_PATH;
 if(!cli)throw Error('Set PLAYWRIGHT_CLI_PATH to playwright-cli.js');
 const r=spawnSync(process.execPath,[cli,'-s='+session,'run-code',code],{encoding:'utf8',maxBuffer:32*1024*1024,timeout:90000,windowsHide:true});
 if(r.error||r.status!==0||/### Error/.test(r.stdout))throw Error(r.error?.message||r.stdout+r.stderr);
 const match=r.stdout.match(/### Result\r?\n([\s\S]*?)(?=\r?\n### |$)/);
 if(!match)throw Error('Missing browser result: '+r.stdout);
 return JSON.parse(match[1]);
}

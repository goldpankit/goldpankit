const mysql = require('./utils/db/mysql')
const nc = require('./utils/node-command')
const translator = require('./service.translator')

// nc.exec('/Users/caesar/Downloads/test', 'npm install mysql')
//   .then(() => {
//     console.log('node command exec completed.')
//   })
//   .catch(e => {
//     console.log('e', e)
//   })

// mysql.getTables({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'local@123',
//   database: 'db_eva'
// }, true)
//   .then(table => {
//     console.log(JSON.stringify(table, null, 2))
//   })
//   .catch(e => {
//     console.log('e', e)
//   })

const content = `
#{test.test}
#{abcd.abcd}
`
const source = '#\{(.*)\}'
const target = '#{(.*)}'
function translate (filepath, content) {
  return {filepath, content}
}
const code = `(function translate(filepath,content) {
            return {filepath: filepath, content: content};
        })(\`ruoyi-admin/src/main/java//RuoYiApplication.java\`,\`package 

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

/**
 * 启动程序
 * 
 * @author ruoyi
 */
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class RuoYiApplication
{
    public static void main(String[] args)
    {
        // System.setProperty("spring.devtools.restart.enabled", "false");
        SpringApplication.run(RuoYiApplication.class, args);
        System.out.println("(♥◠‿◠)ﾉﾞ  若依启动成功   ლ(´ڡ\`ლ)ﾞ  \n" +
                " .-------.       ____     __        \n" +
                " |  _ _   \\      \\   \\   /  /    \n" +
                " | ( ' )  |       \\  _. /  '       \n" +
                " |(_ o _) /        _( )_ .'         \n" +
                " | (_,_).' __  ___(_ o _)'          \n" +
                " |  |\\ \\  |  ||   |(_,_)'         \n" +
                " |  | \\ \`'   /|   \`-'  /           \n" +
                " |  |  \\    /  \\      /           \n" +
                " ''-'   \`'-'    \`-..-'              ");
    }
}\`)`
console.log(eval(code))

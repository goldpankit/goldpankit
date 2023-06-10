const mysql = require('./utils/db/mysql')
const nc = require('./utils/node-command')
const translator = require('./service.translator')
const fs = require('./utils/fs')

const fileInfo = fs.readFile('/Users/caesar/adjustrd/goldpankit/spaces/ruoyi/RuoYi/ruoyi-admin/src/main/resources/static/ajax/libs/jquery-ztree/3.5/css/default/img/diy/9.png')
console.log('本地内容', fileInfo.content)
// const buffer = Buffer.from(fileInfo.content, 'base64')
// fs.createFile('/Users/caesar/lib/图片/logo/1.1.png', buffer)

function translate (filepath, content, fileSetting) {
  if (content == null) {
    return {filepath: filepath, content: content};
  }
  if (fileSetting.compiler === 'static') {
    return {filepath: filepath, content: content};
  }
  if (filepath.split('/').pop() === 'pom.xml') {
    return {filepath: filepath, content: content};
  }
  content = content.replace(/#{/g, '<#noparse>#{</#noparse>')
  return {filepath: filepath, content: content};
}
const content = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.ruoyi.generator.mapper.GenTableColumnMapper">
    
    <resultMap type="GenTableColumn" id="GenTableColumnResult">
        <id     property="columnId"       column="column_id"      />
        <result property="tableId"        column="table_id"       />
        <result property="columnName"     column="column_name"    />
        <result property="columnComment"  column="column_comment" />
        <result property="columnType"     column="column_type"    />
        <result property="javaType"       column="java_type"      />
        <result property="javaField"      column="java_field"     />
        <result property="isPk"           column="is_pk"          />
        <result property="isIncrement"    column="is_increment"   />
        <result property="isRequired"     column="is_required"    />
        <result property="isInsert"       column="is_insert"      />
        <result property="isEdit"         column="is_edit"        />
        <result property="isList"         column="is_list"        />
        <result property="isQuery"        column="is_query"       />
        <result property="queryType"      column="query_type"     />
        <result property="htmlType"       column="html_type"      />
        <result property="dictType"       column="dict_type"      />
        <result property="sort"           column="sort"           />
        <result property="createBy"       column="create_by"      />
        <result property="createTime"     column="create_time"    />
        <result property="updateBy"       column="update_by"      />
        <result property="updateTime"     column="update_time"    />
    </resultMap>
\t
\t<sql id="selectGenTableColumnVo">
        select column_id, table_id, column_name, column_comment, column_type, java_type, java_field, is_pk, is_increment, is_required, is_insert, is_edit, is_list, is_query, query_type, html_type, dict_type, sort, create_by, create_time, update_by, update_time from gen_table_column
    </sql>
\t
    <select id="selectGenTableColumnListByTableId" parameterType="GenTableColumn" resultMap="GenTableColumnResult">
        <include refid="selectGenTableColumnVo"/>
        where table_id = #{tableId}
        order by sort
    </select>
    
    <select id="selectDbTableColumnsByName" parameterType="String" resultMap="GenTableColumnResult">
\t\tselect column_name, (case when (is_nullable = 'no' <![CDATA[ && ]]> column_key != 'PRI') then '1' else null end) as is_required, (case when column_key = 'PRI' then '1' else '0' end) as is_pk, ordinal_position as sort, column_comment, (case when extra = 'auto_increment' then '1' else '0' end) as is_increment, column_type
\t\tfrom information_schema.columns where table_schema = (select database()) and table_name = (#{tableName})
\t\torder by ordinal_position
\t</select>
    
    <insert id="insertGenTableColumn" parameterType="GenTableColumn" useGeneratedKeys="true" keyProperty="columnId">
        insert into gen_table_column (
\t\t\t<if test="tableId != null and tableId != ''">table_id,</if>
\t\t\t<if test="columnName != null and columnName != ''">column_name,</if>
\t\t\t<if test="columnComment != null and columnComment != ''">column_comment,</if>
\t\t\t<if test="columnType != null and columnType != ''">column_type,</if>
\t\t\t<if test="javaType != null and javaType != ''">java_type,</if>
\t\t\t<if test="javaField != null  and javaField != ''">java_field,</if>
\t\t\t<if test="isPk != null and isPk != ''">is_pk,</if>
\t\t\t<if test="isIncrement != null and isIncrement != ''">is_increment,</if>
\t\t\t<if test="isRequired != null and isRequired != ''">is_required,</if>
\t\t\t<if test="isInsert != null and isInsert != ''">is_insert,</if>
\t\t\t<if test="isEdit != null and isEdit != ''">is_edit,</if>
\t\t\t<if test="isList != null and isList != ''">is_list,</if>
\t\t\t<if test="isQuery != null and isQuery != ''">is_query,</if>
\t\t\t<if test="queryType != null and queryType != ''">query_type,</if>
\t\t\t<if test="htmlType != null and htmlType != ''">html_type,</if>
\t\t\t<if test="dictType != null and dictType != ''">dict_type,</if>
\t\t\t<if test="sort != null">sort,</if>
\t\t\t<if test="createBy != null and createBy != ''">create_by,</if>
\t\t\tcreate_time
         )values(
\t\t\t<if test="tableId != null and tableId != ''">#{tableId},</if>
\t\t\t<if test="columnName != null and columnName != ''">#{columnName},</if>
\t\t\t<if test="columnComment != null and columnComment != ''">#{columnComment},</if>
\t\t\t<if test="columnType != null and columnType != ''">#{columnType},</if>
\t\t\t<if test="javaType != null and javaType != ''">#{javaType},</if>
\t\t\t<if test="javaField != null and javaField != ''">#{javaField},</if>
\t\t\t<if test="isPk != null and isPk != ''">#{isPk},</if>
\t\t\t<if test="isIncrement != null and isIncrement != ''">#{isIncrement},</if>
\t\t\t<if test="isRequired != null and isRequired != ''">#{isRequired},</if>
\t\t\t<if test="isInsert != null and isInsert != ''">#{isInsert},</if>
\t\t\t<if test="isEdit != null and isEdit != ''">#{isEdit},</if>
\t\t\t<if test="isList != null and isList != ''">#{isList},</if>
\t\t\t<if test="isQuery != null and isQuery != ''">#{isQuery},</if>
\t\t\t<if test="queryType != null and queryType != ''">#{queryType},</if>
\t\t\t<if test="htmlType != null and htmlType != ''">#{htmlType},</if>
\t\t\t<if test="dictType != null and dictType != ''">#{dictType},</if>
\t\t\t<if test="sort != null">#{sort},</if>
\t\t\t<if test="createBy != null and createBy != ''">#{createBy},</if>
\t\t\tsysdate()
         )
    </insert>
\t 
    <update id="updateGenTableColumn" parameterType="GenTableColumn">
        update gen_table_column
        <set>
            column_comment = #{columnComment},
            java_type = #{javaType},
            java_field = #{javaField},
            is_insert = #{isInsert},
            is_edit = #{isEdit},
            is_list = #{isList},
            is_query = #{isQuery},
            is_required = #{isRequired},
            query_type = #{queryType},
            html_type = #{htmlType},
            dict_type = #{dictType},
            sort = #{sort},
            update_by = #{updateBy},
            update_time = sysdate()
        </set>
        where column_id = #{columnId}
    </update>

    <delete id="deleteGenTableColumnByIds" parameterType="Long">
        delete from gen_table_column where table_id in 
        <foreach collection="array" item="tableId" open="(" separator="," close=")">
            #{tableId}
        </foreach>
    </delete>

    <delete id="deleteGenTableColumns">
        delete from gen_table_column where column_id in 
        <foreach collection="list" item="item" open="(" separator="," close=")">
            #{item.columnId}
        </foreach>
    </delete>

</mapper>`

console.log(translate('test.xml', content, {}))

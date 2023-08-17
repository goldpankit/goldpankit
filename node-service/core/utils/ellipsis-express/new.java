package com.myeva.core.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 工具包
 * @author Eva.Caesar Liu
 * @since 2023/08/17 10:34
 */
@Component
public final class Utils {

    /**
     * 监听器
     */
    public static final Monitor Monitor = new Monitor();

    /**
     * Spring上下文
     */
    public static ApplicationContextHelper SpringContext;

    /**
     * 地区处理
     */
    public static final Location Location = new Location();

    /**
     * Http请求处理
     */
    public static final Http Http = new Http();

    /**
     * 用户客户端信息
     */
    public static final UserClient User_Client = new UserClient();

    /**
     * 服务端信息
     */
    public static final Server Server = new Server();

    /**
     * 监听器
     */
    public static final Monitor Monitor = new Monitor();

    /**
     * MyBatis Plus处理
     */
    public static final MyBatisPlus MP = new MyBatisPlus();

    /**
     * 安全处理
     */
    public static Secure Secure;

    /**
     * 日期处理
     */
    public static final DateHelper Date = new DateHelper();

    /**
     * 线程池
     */
    public static final ThreadPool ThreadPool = new ThreadPool();

    /**
     * AES
     */
    public static AES AES;

    @Autowired
    public void setSpringContext(ApplicationContextHelper springContext) {
        Utils.SpringContext = springContext;
    }

    @Autowired
    public void setSecure(Secure secure) {
        Utils.Secure = secure;
    }

    @Autowired
    public void setAES (AES aes) {
        Utils.AES = aes;
    }

}

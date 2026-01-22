package com.bank.banking_app.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class   JwtUtil {
    private static final String SECRET =  "banking-application-secret-key-1234567890123456";

    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;
//    Converts the string secret into a cryptographic Key object.
//
//    Why needed:
//
//    JWT library doesn’t accept raw string
//
//    Needs java.security.Key type
//
//    hmacShaKeyFor():
//
//    Creates key suitable for HMAC SHA algorithms (HS256)
    private static final Key KEY =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    public static String generateToken(String subject){
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }
    public static String extraSubject(String token){
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public static boolean isValid(String token){
        try{
            extraSubject(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }

}

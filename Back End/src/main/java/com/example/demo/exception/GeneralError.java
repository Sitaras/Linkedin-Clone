package com.example.demo.exception;

public class GeneralError extends RuntimeException{
    public GeneralError(String message) {
        super(message);
    }
    public GeneralError(String message, Exception e) {
        super(message,e);
    }
}

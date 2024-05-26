package mz.hc.web.exception;

public class GatewayPostException extends RuntimeException{

    public GatewayPostException() {
    }

    public GatewayPostException(String message) {
        super(message);
    }

    public GatewayPostException(String message, Throwable cause) {
        super(message, cause);
    }

    public GatewayPostException(Throwable cause) {
        super(cause);
    }
}

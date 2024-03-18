package mz.hc.web.common.pagination;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;


public class DefaultPaginationManager implements PaginationManager {
    
    @SuppressWarnings( "unused" )
    private Map< String, PaginationRenderer > rendererType;
    
    public void setRendererType( Map< String, PaginationRenderer > rendererType ) {
        this.rendererType = rendererType;
    }
    
    public PaginationRenderer getRendererType( String type ) {
        
        PaginationRenderer renderer = null;
        
        type = StringUtils.isEmpty( type ) ? "" : type;
        
        // 페이징 디자인 추가시
        switch ( type ) {
            case "custom" :
                renderer = new CustomPaginationRenderer();
                break;
            default :
                renderer = new DefaultPaginationRenderer();
                break;
        }
        
        return renderer;
    }
    
}

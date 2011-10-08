<%@ include file="/WEB-INF/jsp/include.jsp" %>
<tiles:insertDefinition name="baseNoSide">
	<tiles:putAttribute name="mainContent" type="string">

	<div class="splashContainer">
	<div class="dontMiss">
        <cms:content contentType="Homepage Banner Ad" contentItemVar="item">
            <a href="${item.targetUrl}"><img src="${item.imageUrl}" /></a>
        </cms:content>
	</div>
	<div class="sidePromoContainer">
        <cms:content contentType="Homepage Small Ad" count="2" contentListVar="itemList">
            <c:forEach var="item" items="${itemList}">
                <div class="sidePromo">
			        <a href="${item.targetUrl}"><img src="${item.imageUrl}" /></a>
		        </div>
            </c:forEach>
        </cms:content>
	</div>

	</tiles:putAttribute>
</tiles:insertDefinition>
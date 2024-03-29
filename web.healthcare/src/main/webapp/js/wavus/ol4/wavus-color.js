window.wavus = window.wavus || {};

wavus.color = (function () {

	/**
	 * P054 : 공부상지목, 사실지목()
	 */
	var psssiRightColor_P054 = {
		'전': 1,
		'답': 2,
		'과수원': 3,
		'목장용지': 4,
		'임야': 5,
		'광천지': 6,
		'염전': 7,
		'대': 8,
		'공장용지': 9,
		'학교용지': 10,
		'도로': 11,
		'철도용지': 12,
		'하천': 13,
		'제방': 14,
		'구거': 15,
		'유지': 16,
		'수도용지': 17,
		'공원': 18,
		'체육용지': 19,
		'유원지': 20,
		'종교용지': 21,
		'사적지': 22,
		'묘지': 23,
		'잡종지': 24,
		'주차장': 25,
		'주유소용지': 26,
		'창고용지': 27,
		'양어장': 28
	}

	/**
	 * P052 : 재산종목(ASST_ITEM)
	 */
	var psssiRightColor_P052 = {
		'재활용군용지': 1,
		'재활용예정군용지': 2,
		'병영시설예정지': 3,
		'훈련장예정지': 4,
		'기타사용예정지': 5,
		'건물부지': 6,
		'건물부지': 7,
		'사무소부지': 8,
		'주거부지': 9,
		'공장부지': 10,
		'창고부지': 11,
		'잡옥건부지': 12,
		'예비군건물부지': 13,
		'연병장부지': 14,
		'훈련장부지': 15,
		'표준 훈련장부지': 16,
		'사격훈련장부지': 17,
		'기본훈련장부지': 18,
		'전술훈련장부지': 19,
		'기능훈련장부지': 20,
		'특수훈련장부지': 21,
		'비표준 훈련장 부지': 22,
		'예비군훈련장부지': 23,
		'미군훈련장부지': 24,
		'기타훈련장부지': 25,
		'축성시설부지': 26,
		'축성시설부지': 27,
		'방카부지': 28,
		'진지부지': 29,
		'전술도로부지': 30,
		'진입로부지': 31,
		'방벽고부지': 32,
		'장애물부지': 33,
		'기타축성시설': 34,
		'싸이트부지': 35,
		'방공포진지부지': 36,
		'통신중계시설부지': 37,
		'관측소부지': 38,
		'기타사이트부지': 39,
		'저장시설부지': 40,
		'탄약고부지': 41,
		'편성탄약고부지': 42,
		'시설탄약고부지': 43,
		'예비군탄약고부지': 44,
		'미군탄약고부지': 45,
		'특수탄약고부지': 46,
		'안전지역(탄약고)': 47,
		'연료저장고부지': 48,
		'유류저장고부지': 49,
		'개스저장고부지': 50,
		'안전지역(연료저장)': 51,
		'송유관로부지': 52,
		'비행장부지': 53,
		'비행장부지': 54,
		'전술항공작전기지부지': 55,
		'지원항공작전기지부지': 56,
		'예비기지부지': 57,
		'비상활주로부지': 58,
		'헬기이착륙장부지': 59,
		'경비행장부지': 60,
		'항만시설부지': 61,
		'항만시설부지': 62,
		'부두시설용지': 63,
		'선거용지': 64,
		'물양장용지': 65,
		'방파제용지': 66,
		'공공용지': 67,
		'공공용지': 68,
		'도로용지': 69,
		'구거 및 하천용지': 70,
		'제방용지': 71,
		'상수도용지': 72,
		'하수도용지': 73,
		'공동구용지': 74,
		'철도용지': 75,
		'궤도용지': 76,
		'하역장용지': 77,
		'야적장용지': 78,
		'유수지용지': 79,
		'공원 등 용지': 80,
		'공원용지': 81,
		'광장용지': 82,
		'녹지지역': 83,
		'녹지지역': 84,
		'주변임야': 85,
		'보존보호림': 86,
		'묘역부지': 87,
		'정원및잔듸밭': 88,
		'골프장': 89,
		'전적비부지': 90,
		'기타녹지': 91,
		'미활용군용지': 92,
		'매각예정미활용군용지': 93,
		'매각대상': 94,
		'총괄청인계예정미활용군용지': 95,
		'총괄청인계대상': 96,
		'양여/교환예정미활용군용지': 97,
		'교환': 98,
		'양여': 99,
		'재활용부지': 100,
		'병영시설예정지': 101,
		'군숙소예정지': 102,
		'훈련장예정지': 103,
		'교환예정지 ': 104,
		'기타사용계획': 105,
		'매각지연': 106
	};

	/**
	 * P046 : 차용(LOAN)
	 */
	var psssiRightColor_P046 = {
		'임대차계약(유상)': 1,
		'무상사용허가': 2,
		'사용동의': 3,
		'징발사용': 4,
		'적법절차없이사용': 5,
		'지상권설정(유상)': 6,
		'지상권설정(무상)': 7,
		'지역권설정(유상)': 8,
		'지역권설정(무상)': 9,
		'사용승인': 10
	}

	/**
	 * P115 : 취득방법(GAIN_MTHD)
	 */
	var psssiRightColor_P115 = {
		'현금매수': 1,
		'증권수용(특조령)': 2,
		'징발사용(국,공유지)': 3,
		'기부채납': 4,
		'관리환': 5,
		'보관환,정리채': 6,
		'교환': 7,
		'소유권보존': 8,
		'관리청지정': 9,
		'국가귀속': 10,
		'공유수면매립': 11,
		'환지': 12,
		'기타': 13,
		'수용(공익사업법)': 14,
		'무주부동산취득': 15,
		'증권매수(징특법)': 16,
		'BTL취득': 17,
		'사용승인': 18
	}

	/**
	 * P039 : 소유구분(ASST_OWNER)
	 */
	var psssiRightColor_P039 = {
		'국유': 1,
		'국': 1,
		'국유': 3,
		'공유재산': 5,
		'지방자치단체': 6,
		'공공기관(공법인)': 7,
		'사유재산': 8,
		'개인(법인)소유': 9,
		'소관불명국유': 10,
		'소관불명국유': 11,
		'소유미상': 12,
		'미등록(지적미복구)': 13,
		'소유미상': 14
	}

	var bldngRightColor = {
		'Y' : 1,
		'N'	: 7,
		'null' : 3
	}

	var mluntUnsdaraColor = {
		'1' : 10,
		'2' : 23
	}

	var module = {
		psssiRightColor_P054: psssiRightColor_P054,
		psssiRightColor_P052: psssiRightColor_P052,
		psssiRightColor_P046: psssiRightColor_P046,
		psssiRightColor_P115: psssiRightColor_P115,
		psssiRightColor_P039: psssiRightColor_P039,
		bldngRightColor : bldngRightColor,
		mluntUnsdaraColor : mluntUnsdaraColor
	}

	return module;

})();
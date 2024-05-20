//region IMPORTS
"use client";
//context to provide acocount info

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Account } from "@/type/account";
import { LCategory, Location } from "@/type/location";
import { distance } from "@/utils/location";
import { signIn, useSession } from "next-auth/react";
import { isEqual } from "lodash";
import { useGeolocated } from "react-geolocated";
import { useToast } from "../ui/use-toast";
//endregion

//region CONSTANT
const MINUTE_MS = 60000;
const DEFAULT_LOC: Location = {
  name: "",
  category: "museum",
  hours: [
    [0, 0],
    [20, 34],
    [20, 34],
    [20, 34],
    [20, 34],
    [20, 34],
    [0, 0],
  ],
  importance: 1,
  lon: 0,
  lat: 0,
  zoom: 15,
  imgs: [],
  status: {
    checkSum: "",
    isArchived: false,
    isDeleted: false,
    archivedAt: undefined,
    createdAt: new Date(),
  },
};

const DEFAULT_ACCOUNT: Account = {
  name: "new user",
  email: "",
  currentProfile: "Default",
  profiles: [
    {
      name: "Default",
      locations: [
        {
          name: "University of California, Berkeley",
          id: "ChIJwdcixRh3j4ARiTJrO-o0gNo",
          original_categories: [
            "university",
            "point_of_interest",
            "establishment",
          ],
          category: "other",
          hours: [
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
          ],
          importance: 1,
          lon: -122.2594606,
          lat: 37.870151,
          zoom: 15,
          imgs: [
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZnjIbAJsCps20bt_6aVeHDeGe-MgAsFr8NlDsiYj1HTZRJXBm3k7eLlLEmJ7V55ChgMZYtJ7xPm-4AfohfhqXAedYVYJi265sM3Tcfjpw6OvVHBwWV8zcyzlRl5KAD5-82rswLyYI1Rc5awtC2R5dfr_DbfsQqL7JKtlS-RltY0UeVD&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZkrHoCR89IJUVqIQeGs90om_STd-r1gkLBu0edu8PXWpYsUxptFxHIt5z1_1zikEaGLvBu8oZXW_nFe-sElXiXIr7qYfpnhk9lRsWnTTsNsFQlG_l7LqN-kJUPohOs57xaY5XyOHZCuv-LR9tesOFF2CPlH8xTO9iyckCnKX-5kMLBb&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZk-YFW1I8DhkrtMpm4ww9U6MotkD1KlQXvG64BLFc_5vYKMOQI_PHF9EEXhWFituxOGkD1yq_mY7a20qhOD8RojvdArzU8O4NbLPK4HWn7Fb_xMAIWNGkgffd4fkLGPmoN3Kx0XmjB6fcTKoaO9NqKyCk5xT6hihAQwm95INZDCvW6V&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZllz45v8yfT_wwLrwNJH5S67u4_iI9vFeJBCFreDCz1LPqGA4l4mnHwh0edRYEgBFf5Wku8VluplBwFYfvnR7Fo8aPrt2rkvWsTPTmYWKC9SKKny67DFIhUtsbB8uYV0AT9Kv5MGrIbp-B_PpiZJpCQFZAWJzfYXQkYkadRXqEUYnQi&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZkd9niy_ZOMYpaeSrpDEAA3JfnSyFEHBh1xk32kOat6TTSwixHRP_o76ASciOZFLxJMTR8n4zlAhJblj8C4PFotBwB_DuX8AQT9IyNDjNQc8O5O1BKdziPrl_IBvNsdCir2iVKQngRXlqs-Q9VxPqxaaJe-LGGbqEFcz_GrDQEDelFs&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZmNzUPPkyoTpqd1OdoZYez2M7mk7wZ_VckXGZ5MxXRrcBm_62ywwGOV7pNvIfUJM0YaG5BQekX09JkuPrrKoI7PdDRBBR8wJdXRbuscN0G_cekyWVNTRVlCR2vaeQOL_LNgHFiookUArX8OocTropQ55ObI5W_LkOHjYWD2mJwL31ca&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZlO-f4iH46pUDH_MKyImFfIgLi9qTbbxeu0fcdAVKY9k_hjYctR6Pi7owzgO7Y6z366MqxiZIkKa2DDnBOg2Eu0fF1OZPUpXZuw5n5Y_DOrInmi3ZbGBgRjiwrWAWVqA_52d2mCSl5K7nbteEvOKjJjbVK87CPH3fHJBlHaUxdmqosl&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZm1PGIOnAswoNSsBp_wWTrXt9Tk1ZbiWDhv3re6gpFu-TPXXrgIAoaMF7vR6VIhdoJgHCqrvXja1XgK5TEVArrY2norvJkSM5sAGYByOf8LUR-EaG6jHFLrdW5XhrrpPJEpQjAX6iGwMD7v1sitwYBy8hSrpzJ-nnJFT6o1CIX2WUc5&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZmi3ZUVn49VR_1NQO-9P8JhHyeFaAZZ0lS_PKVwSeqihvx_F5pMAYfvIqmoogPvLZxr8-Do6NKGrzxqXRvQrdMk3i8JZLghnRJ1V92TT45Gn0BttNVNFfqc5KTlH44amS1jOhNNuJ3yWAmRTrXHVcXynQEck290alVYlaGUw3OVXSoP&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=AUGGfZmssSr3c-C8fjVuAamIE2WHM3osCaumfV_qvf6YW3sqlD0M4TYcp0Ozsz7a_VU2XAqi1GYlkz5kgEupVTCrPVPzTRp_f_2afKwwmp4K_un_iWHfNMHQAqxk235NFAcF2lSc-fulQvcyAagSQRt0CbUVmbsHbzdTrA3Q19uXJahFS7cx&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
          ],
          website: "https://www.berkeley.edu/",
          status: {
            checkSum: "",
            isArchived: false,
            isDeleted: false,
            createdAt: new Date(),
          },
          vars: { viewDistance: 21.302159700527593 },
        },
        {
          name: "San Francisco",
          id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
          original_categories: ["locality", "political"],
          category: "other",
          hours: [
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
          ],
          importance: 1,
          lon: -122.4194155,
          lat: 37.7749295,
          zoom: 15,
          imgs: [
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnHV_ekjJGusLbVpJv1UcvWtshiLPzkOCLm19csNv2pnLtdmWcOCejrAJDAgOxct0iDg9-asxyeuZEpOGCAHfsZt9kpeiok3mmOrlj-aE8JhvSJ5wI5BUNRchnwFamisk6NKQzGk56xbOFwSW5kxYqnuwkew_yS1-nQeLNUN0thExNa&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlFU8lGbgWlhxuK8DISUuSmqCcSKviZzgOEcStumzTlhWVKWJLHeUojYqMO4ccKvXtpOaNevIj_C9nZhxcn25kvQ1LTZfTT_aCiATiFE2Ujkps-9EJP36sf9hllcs-6mGYqfpu1qgBTe5xjR1bUB9aUQy8gEH3eOWuSx9qudJsaJq3S&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZn7RlV1_j9Iuzd39Isee4j-QgSXoKKyjgPY_IDX0wEBPvCCxU-YRl9usQqi0X79_bUb6a2jgrugpWEFSno_bjz59s3X444Rj4fsXxwnCAlb9o4yDI13m_5o_VaEn0Tgw_U7Wkp6RWfmWhNLjWFDXFtOy6rMTTlJkJLVtNV3l9ruifJU&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlVnsgxSk1b-HdDatL_zn6MMBiPgNLhtRxRqpx5TrGg-pt0GG5OITxprmNk81ZVXvdDgENMz0x92DU4CWi7gwlnrar4bBXvwGGRo_iK2J5HVjsnWUEg_lgmolwf7DfpaVjkri3PwQt7WwPyvWRnZpzqcMM2YHuM0FpvYm0v5IYTua0&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnQiCwwxLwwXFVwsXs_kpg9A85fR-WJv49LvAv9u5ETQKe9hy2ruzmIeGAVDfT2j1Qtr6HkYFdjEEymmzGpwKxM4F1tD5ejqNX3vmiHntvir_zCx2sYkvs6CnQVDkUq2X_o9p_8pYApjV31qtROyuMI-iy4i_I6WTvo6p4zhQD-PMTw&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmcPqUfhu4OC9dxbzY15ioKVJF02HJRDMpgEtA1X7Em6bVruJvgMvGCXPA_6qdjz03-_W6ymGtZ3wbPntTaw1H7tn4Eau2xkbxm5qP7VPASYCFzjIYq34tjD43_Nn7Rg2kYRMm3UwCenZtrMdhWa2Z2s6Q-jGJSVpVEYNymqe6uznJz&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmCgJZSv93jCQ_YYhjRhk5mpR2mnWgjjbYquBhwkPDid_RPWC66857wy9o25W-AqJQv7hbvBjH2bkGs4zQSUfVNe0MJyM5gERz7WBGjheJFiPEli3SqNpwoO6y-3_FKlP0p2b_jLoa6eEtwVcPcBN8bahYjZgWKOWE65kVbjf-Wp6bo&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmSno04VvBGR0uSQYUFerNSd3tC_ak_MzNYq90cLqugBp_sJjaNhetVuqIsUlg_L6WXF2EHpN9dkCjzSgdd0D1TeUis2SBKp2jECYyfcm2R0TTAEIgihyoWqjPewcLBHL1pX9uYf6haxevmvvNSe1Lb17Q9f_11B0qmMnkWxG7PL0YL&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnoMFH2tYK3Nx4ufsbrGz0ulbzkshYPSwNir2JDKj7LRnSqxYunetjzvKtSYbcZ0rXW-nZxj6xbrZ_jwIDyD1HCPpFsfRPcFqzA1xWtX5slvGvpVhbLmr3jGbOm5zQBbFBiabQk3STh2njpfTQrLWKBqQptTBsS7JBa_VRdePTNcI6A&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZniz3tck9a6_1o87UaYOwLSziESbNLNmYFwmb1FXfvNikHHWaPxDGRyGo3AZbvf_xNiYJFL4GBGoqsunEXLlRpa57abVtkXDpcrxzJl3xRXK9oeSWvXNMCbsH4A1tdFoz6BtJxWbjNXOfu6Kxb-I5QVCHQz-QyZ-dXJvK4ab-9JEanr&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
          ],
          website: "http://sfgov.org/",
          status: {
            checkSum: "",
            isArchived: false,
            isDeleted: false,
            createdAt: new Date(),
          },
          vars: { viewDistance: 4.141297962207204 },
        },
        {
          name: "Stanford University",
          id: "ChIJneqLZyq7j4ARf2j8RBrwzSk",
          original_categories: [
            "university",
            "point_of_interest",
            "establishment",
          ],
          category: "other",
          hours: [
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
          ],
          importance: 2,
          lon: -122.17006,
          lat: 37.42766,
          zoom: 15,
          imgs: [
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmeigaMVhqN68LgIbWFr4Cd1wT75hWqONKgxSGJOtEz70Y5Ewyvqpmn2qPkzXrYWpO3s5_vgXZUqbfBmMbeEPnR2tDfhZZ3G6lxgQHn_U-CfsCLsnTw_jrjFr--jpNLb-Ie1wtU_k1ZdGVvDJDEbZURX9Y-bbxzumE9qHFZ2gAT97HX&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkWLk8lPsWHBR5MXtKbjWMEVHsUcIvWWusQbZoEn2gXzgEXYxYyDNW6hG7fgt1-gj2FS8WZtvHRReWjcKFCi77em2PEw71WC4g0gpFRu-2JnKfgtFasAs1r-CTN7OGqlsSleEYG7JXedCn7YLOtx245yiBSVpK47uxBM4edqSFZGoiP&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkDMn10rQgQI_vUtsS7_EuxPpZH0gy20za5U7m40SPkzeUcwEF-Yqhf32adyiPwM1jeyGzOZtOIlqRV3JLW2jGSqSmlLT_VLn8GBB-FPLJ67Y44i64j9w6uVoSel7pUH4LOEUCEm_8eitmaTz8WBnD3oDPJ6kYaYnGOjx8opIAl664B&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmfwaMQUYDG_Zd09ldZLmXjDwSppnzE6EubTp_LHzorWQRMP8FOUEz6Q8dfhrfsiKQ-s-FpvxseZHWdtjWbajoCtiqp43P8XDodh1UGxftwAjgtl6uLMW4i0Bx7DZLnWNNZohOJ4P2zBRUs9JJbv8dvpEtHIql6rw4rSokCO3jgg1Zh&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlaNLVWV2TIJDHsTIUV9oMOKLKX3LZK1U1OOK2nAqzSBSuOKKiFlSJ2u059-50Ibt2yz6xRKOg9hNwHmvbEfcQFetjFvx2_k3013uv8sMHmAf5S1cKS2MAdFdYt902ratv4gp8VYAdcHPyLNbQHPYf3HSh8QelTstt9BnVqKOw4jpik&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZl1QAVmanqnzGiJ9aqS65Rt_CjevbAjDCMq7B8p-YjvFgetjiudLtGuX1I0RzyK_GAA9xCq2JyLnFEPak2wvMVsLgVL1Cr1Wamb_2oocTfwWExWR80pNPaYzZCn8JVsfXYUhJeatFIrtvj29dD86JakJ_aM0ncPF196Jj_xQS0lC0d3&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkjAOkEUwt-8qcf78I2tCJCKC8lrZoDiswh_f75X1BVpWrgBaPajdiVFLqgT8CyZqD4jEVjU9c5UEDqNppKefbVinTRt_ECuDKZeaEi8BHKh3N-B0vRxKW04be5Vn7RPrDAVykoqdVRvf3KKkIC0i4bnWi_Z3RXiZYogFoEFEDHkbof&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnTMzwPC0KSK22dBDNNNP2K3Ate0C9c32vlbwPWKCbe0JYfIX0NX04dunF_IgQPVvkMtBSa69FQdeW5fijENfx4RAk6A8Ctd110JTBhTvO04uEKIPC0qq9RKTjQ0dBTq3FzfUR69YeNH9aw0do3UH6TaMHOpybpDIdCiPxwW8plDS_a&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnABsCqWdcToN8pAdrtJ1VLvBGeR1-vuY_ZFXRe4mr7mUdQHDHqo2uJSdzYx1VbGqko9_sMtmB5XM1hFRqX6IKR5uGmtW1rHUTk4RjezNF1XL1hRa-ZnyyykWEKn3W3h5C63viwRzTxkL6Jp2UlVApzsux2mgMDxnuNoM79YXSYRk-Z&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlniXoTAgmNVgDvywNjmXQ1WLPRe5ORvVAToK7H3QCJ5H5yyl1a93nuU3VZDEaQf9_kKaEbcgpjz-BTl8_LP1Vfk_2A9vviloXVmQ6oHnAywKZuztSCn4K77IpfoCww0ppVdpUL8yebEk4LNQwlc-RlZjLR-P8GtEVRrJRrtuhTkfeO&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
          ],
          website: "http://www.stanford.edu/",
          status: {
            checkSum: "",
            isArchived: false,
            isDeleted: false,
            createdAt: new Date(),
          },
          vars: { viewDistance: 46.13139433481169 },
        },
        {
          name: "Googleplex",
          id: "ChIJj61dQgK6j4AR4GeTYWZsKWw",
          original_categories: ["point_of_interest", "establishment"],
          category: "other",
          hours: [
            [0, 0],
            [16, 34],
            [16, 34],
            [16, 34],
            [16, 34],
            [16, 34],
            [0, 0],
          ],
          importance: 2,
          lon: -122.0853242,
          lat: 37.4220541,
          zoom: 15,
          imgs: [
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnwisr93O0TspC9DTJlGBVsXVAuFi95RibPFhtTn5ipPjsMtWgmFdj96VtuD4u5cHX78C38_qILf5-bwasy3bNIRclnnm9AoQUQ6YnJRABG7PBbf_SFPT9zPcsNJ3Rbh2oZpxuRolbbkzu6rqk92V6-UOaXISkWmEwLqCGYsieldgPB&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkMsZN7GCa_EtLcEk3kA2eBgENvjdeqYTKsRe9cpER_0Dr2_BSD345sl8XglPSamMoMSoeuzF6Ea1u3aYeSDdxqo5EZIvkCbNJo-wZ4t-w1bl_juUq1IR0QAS_Uhc0GWoYwrVUsVXe9E7_GOJBSIIVVkb3Hz-vnkDxvnGbAbNpq0ZEE&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmTJcNgB6LPZ_GBgOUsUdYqJSPKwIvkuUrfeVp3lZVbK9gqoQPKyImkeryPZ6ts-nbLjAYJhKjxerJlc2Nwe7sqYzfGUkwJjMVqKVjL6v5J7jRSyYtQbJrCOit-pOTm1rY-i0st-AEiCQ2rl-rQ1iDXAmhHLOxW3uSQXPpDmnRpwonV&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZn-oshwK5ReTjw9tpTUJF-9RMDXeJY0xKIU5-g2lzATX-Oov9vktKbA9tqVhX8DQWJYUH2pQgfQLHDrl8S_9MiIQMHFRBf1uCEfN2OqlOlxEm15EpAELGNQGHzavCtTCsCI3juQPFSZyNi7kXkYd0onY5LryyWl5G7VI7KLaXibGwJK&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnA7M9pWswufgsafsHXMHmgIMiHkbcp2osyvELZZNOJQT1cJH48O1mSrbHIFd2FElD0-wZTKWsGXfH-zWuI-cgQpl74X0qIubkos3bs3uxWyfwtzXOdRa6TnDPLlu-juXRQaa1svo-9cYvVMwCUbYRryAMYN3aYB3wvNo-vOcVixb7l&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmxYVFesa7PSjL7Xs3eeXx7ur5UtThRFONSuIzLc0p5Xn02je_QpYo3qjrrI87SNjwln4t-bReoh2AFzTGL24Z68EBvidPIjWUbLSeYC7GdvFYHw2X1DwVxwUtlN60Gq6uQ9cxPElL6gfOqoilqumRT_ZKE-y9Jz85l-Epx4TgSCWnT&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkOZeVhn3RDo6okUUEpnwIdoSOOybKsz9FdEnapN8HaYe4NJ9DzRfuCWnRuk8CPw6qtJJXwtja7UiIglHrSArBYiVZ8ywru1QLCEzWSsD9Mr5NJxDVe4KCIEnNtmVF_OS1lXgct64zoFmpUtblqIdUZS3b7GBEdZn6TRaMQXIc0dY4O&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlxT7n488sbi8d6wolaHFHdbSlOwoXMMog-aAEpaRvmHt-AuoziWJqp7LlaIeHgDuRuuRDnBCCj0qU8YGgBykmLyAtHtJE9Wkg-s0NMuPuzjuIYev-IxSbOgUFzIHCNwt3zjBZXLEluM7JUOgNdj_3VZeHeiWRQKrIx_c7aWz9oBaUb&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnN4FH2qSDJKh_EuHAUWfIuJ-vIHkdx4lwQYytqGbpFC042XDk5EJ3hTVJhKhlkpX-UXK_k-lTl3aaKJbM5eEljrbCELrOQT7-XcjtB6mKmng5RmBc8RiH_xKpa9rR8LmQ_ZSqbgHOb0DypZMq_qWBWGBbJ_Dstt7PFLTqgyryW3Icm&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmTRoDKvoD4c6H34GUYP9uL7vQO3JFS77L-bSPDdDkO2F1HwVL0GmcORwT4gxcHYJnhRkEH8q5nssibFjsGGkmpD0fH2iKuEer2ETFCVudOGpYhaA4z5JRi91c20eYJa3nR1PX-tAvgO-D6l29f-MrbnwmId2u0U2fISnSjWdtkJBni&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
          ],
          website: "https://about.google/locations/?region=north-america",
          status: {
            checkSum: "",
            isArchived: false,
            isDeleted: false,
            createdAt: new Date(),
          },
          vars: { viewDistance: 51.19705519771858 },
        },
        {
          name: "Golden Gate Bridge",
          id: "ChIJw____96GhYARCVVwg5cT7c0",
          original_categories: [
            "tourist_attraction",
            "point_of_interest",
            "establishment",
          ],
          category: "landmark",
          hours: [
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
            [0, 48],
          ],
          importance: 1,
          lon: -122.4785598,
          lat: 37.8199109,
          zoom: 15,
          imgs: [
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnGQvhTKDz0u2VwuPoBDewQpMDPjg7PRHIRr5O_9RrmMMSwdL5ylRj5z5uF5wzYDWqRDIxgMKqnZiMrXT9ZUtDYOuecKphreLgXc4fC8HpZGIo-u4HXCuU3KWOZ8fF6Agknolzoh8CaMT4iOSPD0RsXzGtyRpmg8UGIRlYZRLlumpSv&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnSz4rScYgN1MeFr0vL3YMBSrDePlVTu21PGus9nfa4NI0ysIeTD2NoCqifZcvR3ng0jN8QyvYDs22Ehebo50jxflgaHzbpuo3SzkzH5Yvtd9bL0l1IwNfTjnwrDWIH51fgSZH4GboDBZHy3MwRy9JVJrjSA7qLP_2BQTFQ_GI_xHGX&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZl_DDdNC04yWEsSwgLEBLpNhtjHuWiPYH5EGGqpa9Rt8TjvEgoMwLWSeUsvtbDUGZbw9igkzAc8DHeAqjO4dhe7tbHvZVvwBiwJ5yagW4rI94BXnNrR5AWddQuQB0gwihl4Q3h5rkBRuu3FcYS9TS3bfU2mol4orDw56rQxEwKdjSo-&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlGAEpTLFKoL0RLI2-5-R1rVQfUDnn67qI5m66EvcRRDN_3V8y1TnX1WH-t5cke_X-Ve9hznWon_9gQWf0bNvf9BMvaFIWh0VOYzKTvttlSRiTTGQo6prCToJNSH6lYWqPcyfrDo5I4BJSzb81krQT6pDfFrjJXiqXniAGEoKjDQ6t3&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlPer6lBfbWdwfEQEol9e9TuWP2eLZT72oluYikkGrWsPziTmgEQmyNfZwZbgqAE1nwSuWnge3rnJ1TFR3PXHow4f_8vwdzej4-Nx-gVntiWpAto6IJCnoUrkNfyp76aKXjMh0EtsIdg-2nIVCwiD72liQte4qOAWTbZyay-JWIQC0b&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnlMqMSK-1B8sSB74Uygjpa_jUKvMxzvw9tcyIEp-9UeVom4WwZtv10rnKLMtgOaSF14WfyhzlRxc4zY8q6brxqb4WOJ0jN3DBqetN5zCxoXByuhwHLVyJGt1-0wZZM7jQ3aj3nPHiHy1RpKyZCpDe0qlQsKrBpXIHDMLJgu4xvrhSl&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkvaceTHOTjJRZuhmpGZ56vBjjNStQ79672Z9421kgfvLXRJg5xCkGbI98Tkj7cRE_xCUbw879KiBNup5r3sQsTLkga-Cix97Hj2Ja3UtXVjc6Vjy8vRhoO1a8TVnV2KM1i2SYKFpaAo6KkyH7Nzrhk0h_jzz4fNZhIt3d8ouOJtLvT&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlGRvcqa4y3f3-9ghTHtY3kHa52mNg-Z_qGR4H8qcAiTREybnRv8BLOogj4UZE1HktshK7vIU69iLtoBaJln4WUFPanFzYB2NtcB2j3IQjOl_6I4BLV4yvhb-hlQNctx810rFt2mGVDVd5-3rxU4R2hPxuH3Aa_cRB93DLBmbZzf-8y&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmK-tb4CmKyTEy1Hq6gYJJxu7Vv593lqrZYBvsmU0Cq5fe7FT_nrSTfKRn-fs_cRn8saDIlpPbcjpqZqpgzoxTFd0uSh_MUD5hxJPZfEmew4R5ZMhHdS1X5F_e2NpkT42HRFh8O0IeNm8EoNO7u30GqcUxZKWQbYqHkvIgl_Eqf15Gq&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnChZHFxWS8Er6SnDpcdwZCcF9hbd8dL5nE7Ydx4bPu1B3_4JR2z9ctE_nxr5MrKQlWOi9K7khVZ8q4yiv8Jby43ksBgsRh0jYLCel3TTG_jKP_uLrzhYILXad01ND5M1CwvpRwmzjmveCAmXX41Ea6mGPCP3AEni9ZolgbJAui4W7f&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
          ],
          website: "https://www.goldengate.org/",
          status: {
            checkSum: "",
            isArchived: false,
            isDeleted: false,
            createdAt: new Date(),
          },
          vars: { viewDistance: 5.671655774105688 },
        },
        {
          name: "Exploratorium",
          id: "ChIJk2vl5NSGhYARwPGvs_ubIws",
          original_categories: [
            "tourist_attraction",
            "museum",
            "point_of_interest",
            "establishment",
          ],
          category: "museum",
          hours: [
            [24, 34],
            [0, 0],
            [20, 34],
            [20, 34],
            [36, 44],
            [20, 34],
            [20, 34],
          ],
          importance: 3,
          lon: -122.397348,
          lat: 37.8016649,
          zoom: 15,
          imgs: [
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkIzFmdLIujKv4yHekBwFng5nrbTsd6SK4Y4TnWX-Jr6OFR7VQ2f9cOeNgMe3oo1EKWa1wjFAia2R1N8TktgRo0VJG6PNLjC-IdJjEd675e6tFW23Afcp1V_JZGSIqVTUlX-U-EgtQRptnS_UqDaU6x7vJJS_b8npFDqJETWTV3tr3S&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZn9Q_3J8pNe8VJqiN0PBz3f0MnYPWKp2su_U4fQZrrLGG_LhuPkcSIKaT66Ujd-u_DEp_EMD9V4UCITuiHBqOoQoURQL8nFzqRah_xG1_SY74goMS-tRCyPXxbkxDR6y2OJ2krJ7RtNSeER6F-aRdnpqCLFuaPOcii8MYHXM5Jhw9Jy&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnbVRa7dMjGGD2k0JK7riwRvRQXL4GDBQeQShCwo3HZVFZe_hAj5rX0dE4M9lOjCbHfxQ0p7kJKOXvOZgP1wD1XYE0CsKgZWk2kR9NLWfZfmE6je9cJwcH41hR-Wf-Np2qDKzq4ccjJV3qWhSxxYGSlkCyzGx9lq0vKVQVvj6cCezb1&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmUaKBcu7809PEx-2fmV7zTZ6gQQy1LBms915xOrrWjJokflQV4Ca_6zAMaVeIUbI8dr9Kn13BPsUjiRP4QmfAtc3PCWh9sALXHt37Kj2Q03s76Q0B6TBgQprPnt4ru3vP287KMNWvrU3RbAU21ljKwpym6m6outoXFzqgAnIAJNRLu&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkQKJW5KfUJy36tJ9nMuXWSn2OhYBswfaXGSIeARuzz9EBT3pwsJowRG8YMYk-pb2ElQ2uIPCcNDXLmpuhnzEBlTpxbTTSkEeu6GrgM91T4EXbkGadbAHUq5CQdvEp55WbGJmyNFVvf2cjyzANfUsK7uIt2F0QJ0bxuchfLkR1bqJQV&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnIV9Z7esE1ZRq037IbMFhj9bMD5V-QMID2WwkaD-gCyWIt1xlNdSRztDQ7VPorC_hQow8VFQ1hwPpG-joAPPK0Yg4xJZSDoUcoHWiqpNXA1993H6JgckxWwqpIxKxY88UXm1zN_q4hubDxsR4p6dMCilD_LeS1smdhGS9Do_Dz_7dB&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkUMx1atKVaOPhH5QcWjy4elStmEGzSHmZ7XB5xRX9o92Nk9HD7H11ooYwafImaJLgzQp0f2-wzSotKbQ9wMFuX0vqBgOrbQqC-kuxxTjWSpQzgfgjQXAWON2nDCwMyt0eHSWkjIn0uF1bXHifuSkAByOgndXoO5RADxFG0FPZ4Py3o&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlyH0ILKE0dL6DGMTCDaW9peMohDf-wZpaDNVvMDHRgA-0KAZ-6-3rUM0x1KLjHv7yuHUQtFULb4X3xfOdVu5-FHmlbWnC3K0qUvh-bnah5W6xHpHN_gkNtAdIRynsPckj-PIe5Qy8ZKdLilxvTm5qBzT3ErpksDWjjEI_zPL-sYBDt&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmrwjjLx3qKa4N1_lUnNns6e-W3BapJ4RRAdsEgDYpkYVBj34qZ5QOiOujdI-WFBMSh8zjsmqL_7K3-YLvWG36l0W_2gVIgR-EUClLdQTCxyXPbOpnPUuL8TEy7wS8nbsURx6turVhZQxGg-pDgvVZBgEd5oXVc3cqf-Lb2TIjA2th5&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZlTalch5ItHEs3zomTgTGHOdpqjoMJf9I03v7AuCSfby4A4mo6Ufikk1ROvaWO6kCpRe_8ps4RL0LsdWWXRhfUoUE9HubPpCJ9gThb5il6gsUKMS46oJ0p6mtU5T2FIhTZD-yP_hZ8moRaDPbD3uhpw46VJw0hSy4fm_dxbq7lZyDRi&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
          ],
          website: "https://www.exploratorium.edu/",
          status: {
            checkSum: "",
            isArchived: false,
            isDeleted: false,
            createdAt: new Date(),
          },
          vars: { viewDistance: 7.0000876728777595 },
        },
        {
          name: "California Academy of Sciences",
          id: "ChIJIUT7rEOHhYARucp3wM-HhBs",
          original_categories: [
            "tourist_attraction",
            "aquarium",
            "museum",
            "point_of_interest",
            "establishment",
          ],
          category: "museum",
          hours: [
            [22, 34],
            [19, 34],
            [19, 34],
            [19, 34],
            [19, 34],
            [19, 34],
            [19, 34],
          ],
          importance: 3,
          lon: -122.4660947,
          lat: 37.76986459999999,
          zoom: 15,
          imgs: [
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZkhkJ55D7BWAPsGkV69pfuKVLFv_bCstkJ_tG8LiH4oq5JSN2XAupv9mhBKtjTyT-ixOauAkbIOmJrw6-JqOhKlQRVO0LEJEJNYAfPbKRLtIHpN-r6KwSk96y2YvTYMCLllsvMSmfeE1KBn8c4Ihpmg1rPyy6dLQ46QGHsifwbxrJkX&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZk0ZonL_5WCN-W-TuhK7-XB3RycZhfPKScWM5KSclLrEj9BngmSyFEBrMvExUXI14nNdvyIk3z7Uu9gkWe8ZF86nX2wA0Rf5RSOBFd5RyoqGIRCUHyfPIQ8NonTf1L-4gp2Wvz5wq5QxyvRnRAgUkxNIO-RIdhCNMJU9vPHWqJkw40k&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmB2Sy6650dX-QJFHJAYov49-9HVtkYas5yzxnjmm7_EoYWzq5XwR0DSDrrW82DwveS8c1559mrkcbdC6D5-9mw0mWwQlUwh6KqMbmr8hgJPxKVq8aJ1mwIvVnikbxQYRIvqaNSK237DdcYNYFl-yWbUzQ_D-1eqr9tglL2419we2oF&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZku5Slvrm7n-Lo3vqEpBjpfDyUzdedPUZRKBBF9WMJ2CpM7UkQ2kxWsvqzzbSsH0TXFoOm0Cngb57zDgVzudhtkO_Vl-6VYSfxWe7BsgZDLnfgEp_AfOIU4Rf1z0T8v3iHCyWTHVB_qdcoZqHf9ekV9vGJSxQ_ijkN3rMyeZVbxsbFn&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmqkApQf5tIaasSVV67ebXYrmQQPcpHAoUsQor9bYcym6R16bhXJ_3ls5ISVKpBhlkQmpF0_uD2Gq9NgQwcovw5o2VlAW__6ADhQqXPhWLUj45SJ2qR-RhwUyYWSASOfC1uFuV5iyOQHvj965uBilaQ6Sh-trBqiW_4Q28BKxnwtILg&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZmeDeJxCysvTXdSBTTnDdlz6YU1bH9WZlKVml2KzqRTnm11aW_3H3LE8mEhZdc2UZLfg7iDPI-rf8GMdLFT2KY9EYEm2tAYMEKhHr4lCKPphOg-PuSj5fgtQJTq5QQyyreC1FX-99MNrm8NBFlP9A2_4moJRq8_ZXdQApAH7ql8SCWs&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnYjNVIeibJ72s5KQNGNgMiNMGqQEhuKx4zOxBb5GHlPxG-wyMqpIF2dt3vz4kAXeWPXKkWibkVqRe5LcVEK5J7h8QEhrqvnl73Txe7XqHR9msgFL6Be9BrCrbmo5UDRH8-usXhy5eMu774QkXBFdwO9YqBZUOUjuxHGvJmQ7UBeSDr&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnMxaJ6bMvPU1xu_Eq2NCWhf2BKBtzrnbSJOhxUELaUxwENtLUhq-WF6MmPK4RZOnBv9Qh4l7iyhA4zIkEYI-WjFGUatlVPJPeVZBOS8DU6DJcZI6KqIUnF-FiX_RSzayZ97BVxCK4WmiTlwaZtHIYh1DSgPxXy6lzSDoczRtCEEvg_&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZncdG6XWW3VFfhwFptCyouuucztAJOEo7MKx-gDrQ_4GTSFx3r_Hc5Yaa6zS2UCFNCOy3Sx3UrKIhAppI2PiS7k_EBsBCZ71NNGJh6T41SdztCGeOWkZWpWjMg6KWBTIxRQ1Tod5oVkGTgfbGbAAmjTQP_aDX8tk_z9uAqm3D1h_0FA&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZk_lCv0lioKIQsElCd6xGkh2T599NEsvf_19n7evzMutfPq4QNtYUwxl__QQpF2vPyRt6HN8y_4zB1Kbnq8NTxtIACeW_WXMtvnZJBIHmN5wmfTUosDClM57HZcsazthwhnonKzdf5h_B_6JIC5gUn8t3sIMB38ZZqwybSdaZsVPO0u&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
          ],
          website: "https://www.calacademy.org/",
          status: {
            checkSum: "",
            isArchived: false,
            isDeleted: false,
            createdAt: new Date(),
          },
          vars: { viewDistance: 0 },
        },
      ],
      documents: [],
      cover: "",
      map: "google",
      status: {
        checkSum: "0",
        isArchived: false,
        isDeleted: false,
        createdAt: new Date(),
      },
    },
  ],
  theme: "light",
  subscription: "free",
  status: {
    checkSum: "0",
    isArchived: false,
    isDeleted: false,
    createdAt: new Date(),
  },
};
//endregion

//region TYPE
type LocationEditorContextType = {
  loc: Location;
  setLoc: (loc: Location) => void;
  fetchLocation: (name: string) => void;
  id: number; // -1 add
  invoke: (id: number, name: string) => void;
  //setId: (id: number) => void;
  open: boolean;
  //setOpen: (open: boolean) => void;
  status: "loading" | "ready";
  setStatus: React.Dispatch<React.SetStateAction<"loading" | "ready">>;
  finish: () => void;
};
export type HoursFilter = {
  type: "now" | "anytime" | "select";
  week: number;
  time: number;
};
export type SearchOption = {
  center?: Location;
  viewCenter?: Location;
  hours: HoursFilter;
  lcat: LCategory;
  layer: "roadmap" | "satellite" | "hybrid" | "terrain";
};
export type Vars = {
  heading?: number;
  orient?: DeviceOrientationEvent;
  coords?: GeolocationCoordinates;
  isMobile: boolean;
};
type AccountContextType = {
  account: Account;
  setAccount: React.Dispatch<React.SetStateAction<Account>>;
  locs: Location[];
  locsDispatch: React.Dispatch<any>;
  locEditor: LocationEditorContextType;
  searchOption: SearchOption;
  setSearchOption: React.Dispatch<React.SetStateAction<SearchOption>>;
  vars?: Vars;
};
type AccountProviderProps = {
  children: React.ReactNode;
};
type Action = {
  type: "add" | "edit" | "delete" | "setAll";
  location?: Location;
  index?: number;
  locations?: Location[];
};
//endregion

export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);

// TODO DON'T WAIT FOR ACCOUNT TO BE READY
export const AccountProvider = ({ children }: AccountProviderProps) => {
  //region STATE
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const phase = useRef<"initializing" | "loading" | "ready">("initializing");
  const [searchOption, setSearchOption] = useState<SearchOption>({
    center: undefined,
    hours: {
      type: "anytime",
      week: new Date().getDay(),
      time: new Date().getHours() * 2 + new Date().getMinutes() / 30,
    },
    lcat: "all",
    layer: "roadmap",
  });
  const [account, setAccount] = useState<Account>(DEFAULT_ACCOUNT);
  const locsDispatch = useCallback(
    (action: Action) => {
      const newAccount = { ...account };
      const index = account.profiles.findIndex(
        (profile) => profile.name === account.currentProfile
      );
      switch (action.type) {
        case "add":
          setAccount((prev) => {
            const newAccount = { ...prev };
            const locationExists = newAccount.profiles[index].locations.find(
              (location) => location.name === action.location!.name
            );
            if (locationExists) return newAccount;
            newAccount.profiles[index].locations = [
              ...newAccount.profiles[index].locations,
              action.location!,
            ];
            return newAccount;
          });
          break;
        case "edit":
          setAccount((prev) => {
            const newAccount = { ...prev };
            newAccount.profiles[index].locations = newAccount.profiles[
              index
            ].locations.map((location, index) =>
              index === action.index ? action.location! : location
            );
            return newAccount;
          });
          break;
        case "delete":
          setAccount((prev) => {
            const newAccount = { ...prev };
            newAccount.profiles[index].locations = newAccount.profiles[
              index
            ].locations.filter((_, index) => index !== action.index);
            return newAccount;
          });
          break;
        case "setAll":
          newAccount.profiles[index].locations = action.locations!;
          newAccount.profiles = [...newAccount.profiles];
          setAccount(newAccount);
          break;
      }
    },
    [account]
  );
  const [loc, setLoc] = useState<Location>(DEFAULT_LOC);
  const [lastFetchName, setLastFetchName] = useState<string>("");
  const [editorStatus, setEditorStatus] = useState<"loading" | "ready">(
    "ready"
  );
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<number>(-1);
  const finish = useCallback(() => {
    setOpen(false);
    setLastFetchName("");
    if (id === -1) {
      locsDispatch({ type: "add", location: { ...loc }, index: -1 });
    } else {
      locsDispatch({ type: "edit", location: { ...loc }, index: id });
    }
  }, [loc, id, locsDispatch]);
  const fetchLocation = async (name: string) => {
    if (lastFetchName === name) return;
    toast({ title: "Getting information from Google Map. Please wait..." });
    setEditorStatus("loading");
    const location = await fetch(`/api/location?name=${name}`, {
      method: "POST",
    }).then((res) => res.json());
    if (location) {
      setEditorStatus("ready");
      setLoc(location);
      setLastFetchName(name);
    } else {
      toast({ title: "Failed to fetch location" });
      setEditorStatus("ready");
      setLastFetchName(name);
    }
  };
  const invoke = (id: number, name: string) => {
    let l = loc;
    if (id === -1) {
      l = DEFAULT_LOC;
      l.name = name;
    } else {
      l = locs[id];
    }
    window.history.pushState(null, "", "?open=true");
    if (l.name !== "" && l.name !== lastFetchName && id === -1) {
      fetchLocation(l.name);
    }
    setId(id);
    setLoc(l);
  };
  const saveAccount = async (acc: Account) => {
    if (phase.current !== "ready" || status === "loading") {
      return;
    }
    console.log("change saving...");
    localStorage.setItem("account", JSON.stringify(acc));
    if (session?.user?.email === "") {
      console.log("only local change saved!");
      return;
    }
    await fetch("/api/account", {
      method: "POST",
      body: JSON.stringify(acc),
    });
    console.log("change saved!");
  };

  const locs = useMemo(() => {
    console.log("locs memo");
    saveAccount(account);
    const index = account.profiles.findIndex(
      (profile) => profile.name === account.currentProfile
    );
    return account.profiles[index].locations;
  }, [account, account.profiles, account.currentProfile]);
  const [heading, setHeading] = useState<number | undefined>(undefined);
  const [orient, setOrient] = useState<DeviceOrientationEvent | undefined>(
    undefined
  );
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      watchPosition: true,
      userDecisionTimeout: 5000,
    });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (!navigator) return;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobile(isMobile);
  }, []);

  const vars: Vars = { heading, coords, orient, isMobile };
  //endregion

  //region FUNCTION
  const everyMinute = () => {
    if (searchOption.hours.type === "now") {
      setSearchOption((prev) => ({
        ...prev,
        hours: {
          type: "now",
          week: new Date().getDay(),
          time: new Date().getHours() * 2 + new Date().getMinutes() / 30,
        },
      }));
    }
  };

  //* return undefined when identical
  const fetchAccount = async (cache: Account) => {
    let res;
    try {
      res = (await (
        await fetch(`/api/account/?email=${cache.email}`)
      ).json()) as Account;
    } catch (e) {
      //* cound be destructive
      res = DEFAULT_ACCOUNT;
      res.email = session?.user?.email || "";
      saveAccount(res);
    }
    //console.log("initial synced account", res);
    if (!isEqual(cache, res)) {
      return res;
    }
  };
  const fetchAccountCache = () => {
    let account_cache = DEFAULT_ACCOUNT;
    try {
      const cache = localStorage.getItem("account");
      if (cache !== null) account_cache = JSON.parse(cache) as Account;
    } catch (e) {}
    if (status === "authenticated")
      account_cache.email = session?.user?.email || "";
    // render account
    setAccount(account_cache);
    return account_cache;
  };

  //endregion

  //region EFFECTS
  useEffect(() => {
    if (status === "unauthenticated") signIn();
  }, [status]);

  useEffect(() => {
    if (searchOption.hours.type !== "now") return;
  }, [searchOption.hours.type]);

  useEffect(() => {
    if (phase.current !== "initializing") return;
    console.time("cache");
    const account_cache = fetchAccountCache();
    setAccount(account_cache);
    console.timeEnd("cache");

    if (status === "loading") return;
    phase.current = "loading";
    const interval = setInterval(() => {
      everyMinute();
    }, MINUTE_MS);

    const email = session?.user?.email || "";
    account_cache.email = email;
    if (email === undefined || email === "") {
      phase.current = "ready";
      console.log("initialization completed(not registered)");
      return;
    }
    (async () => {
      const remote = await fetchAccount(account_cache);
      if (remote) {
        setAccount(remote);
      }
      phase.current = "ready";
      console.log("initialization completed");
    })();
    return () => clearInterval(interval);
  }, [status]);
  //* UPLOAD CHANGES
  useEffect(() => {
    saveAccount(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.profiles]);

  useEffect(() => {
    //calculate all distance from center
    if (searchOption.center === undefined) return;
    const center = searchOption.center;
    let newLocs = locs.map((loc) => {
      loc.vars = loc.vars || {};
      loc.vars.distance = distance(center, loc);
      return loc;
    });
    // sort by distance
    newLocs = newLocs.sort((a, b) => {
      return a.vars?.distance! - b.vars?.distance!;
    });
    if (isEqual(newLocs, locs)) return;
    locsDispatch({ type: "setAll", locations: newLocs });
  }, [searchOption.center, locs, locsDispatch]);
  useEffect(() => {
    if (searchOption.viewCenter === undefined || locs.length === 0) return;
    const center = searchOption.viewCenter;
    if (distance(center, locs[0]) == locs[0].vars?.viewDistance) return;

    let newLocs = locs.map((loc) => {
      loc.vars = loc.vars || {};
      loc.vars.viewDistance = distance(center, loc);
      return loc;
    });
    locsDispatch({ type: "setAll", locations: newLocs });
  }, [searchOption.viewCenter, locs, locsDispatch]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.absolute) {
        const mult = event.absolute ? 1 : -1;
        setHeading(event.alpha * mult);
        setOrient(event);
      }
    };
    window.addEventListener("deviceorientationabsolute", handleOrientation);
    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation
      );
    };
  }, []);

  //endregion

  const locEditor: LocationEditorContextType = {
    loc,
    setLoc,
    id,
    open,
    invoke,
    finish,
    status: editorStatus,
    setStatus: setEditorStatus,
    fetchLocation,
  };
  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        locs,
        locsDispatch,
        locEditor,
        searchOption,
        setSearchOption,
        vars,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

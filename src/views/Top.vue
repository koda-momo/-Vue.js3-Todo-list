<template>
  <div class="all">
    <img src="/img/toragao.png" class="toragaoImg" />
    <div class="message">
      {{ sayHallo }}{{ userName }}
      <br />
      今日の{{ userAddress }}の天気は
      <br />
      {{ weather }}です
      <br />
      よき1日を
    </div>
  </div>
  <!-- 天気住所変更コーナー -->
  <div class="address">
    他の場所の天気を見る
    <form>
      <select name="prefectures" id="prefectures" v-model="userAddress">
        <option
          v-for="prefectureName of prefectures"
          :key="prefectureName"
          :value="prefectureName"
        >
          {{ prefectureName }}
        </option>
      </select>
    </form>
  </div>
  <!-- 天気住所変更コーナー -->
</template>

<script lang="ts">
/**
 * Topページ.
 */
import { defineComponent, ref, watchEffect } from "vue";
import axios from "axios";
import { useStore } from "vuex";
export default defineComponent({
  setup() {
    //storeを利用
    const store = useStore();
    //寅さんの挨拶
    const sayHallo = ref("");
    //天気
    const weather = ref("");
    //天気の場所
    const weatherPlace = ref("");
    //天気の場所のコード
    let weatherPlaceCode = "";
    //ログインユーザの住所情報
    let userAddress = ref();
    //ログインユーザの名前
    let userName = ref();
    //都道府県配列
    let prefectures = ref([
      "北海道",
      "青森県",
      "岩手県",
      "宮城県",
      "秋田県",
      "山形県",
      "福島県",
      "茨城県",
      "栃木県",
      "群馬県",
      "埼玉県",
      "千葉県",
      "東京都",
      "神奈川県",
      "新潟県",
      "富山県",
      "石川県",
      "福井県",
      "山梨県",
      "長野県",
      "岐阜県",
      "静岡県",
      "愛知県",
      "三重県",
      "滋賀県",
      "京都府",
      "大阪府",
      "兵庫県",
      "奈良県",
      "和歌山県",
      "鳥取県",
      "島根県",
      "岡山県",
      "広島県",
      "山口県",
      "徳島県",
      "香川県",
      "愛媛県",
      "高知県",
      "福岡県",
      "佐賀県",
      "長崎県",
      "熊本県",
      "大分県",
      "宮崎県",
      "鹿児島県",
      "沖縄県",
    ]);

    /**
     * ユーザのログイン情報取得.
     */
    const getUserInfo = async () => {
      await store.dispatch("getMoneyInfo", "yamada@aaa");
      const response = store.getters.getMoneyInfo;
      userAddress.value = String(response.address);
      userName.value = String(response.name);
    };

    getUserInfo();

    /**
     * 時間によって、寅さんの挨拶を変える.
     */
    const whatNowTime = () => {
      //現在時刻を取得
      const now = new Date();
      //時間と分を取得
      const nowHours = now.getHours();
      const nowMinutes = now.getMinutes();
      //時間を繋げて3-4桁の数字に
      let nowTime = 0;
      if (String(nowMinutes).length === 1) {
        nowTime = Number(String(nowHours) + "0" + String(nowMinutes));
      } else {
        nowTime = Number(String(nowHours) + String(nowMinutes));
      }
      //4:00-10:59 おはよう、11:00-17:59 こんにちは、それ以外こんばんは
      if (Number(nowTime) >= 400 && Number(nowTime) < 1100) {
        sayHallo.value = "おはよう";
      } else if (Number(nowTime) >= 1100 && Number(nowTime) < 1800) {
        sayHallo.value = "こんにちは";
      } else {
        sayHallo.value = "こんばんは";
      }
    };

    whatNowTime();

    /**
     * ユーザの住所にあわせて天気予報取得.
     */
    watchEffect(async () => {
      userAddress.value;
      if (userAddress.value === undefined) {
        return;
      }
      const response1 = await axios.get(
        "http://www.jma.go.jp/bosai/common/const/area.json"
      );
      const allInfo = response1.data.offices;
      const keyNumber = Object.keys(allInfo);

      for (const key of keyNumber) {
        if (allInfo[key].name === userAddress.value) {
          weatherPlaceCode = String(key);
        }
      }
      //北海道と沖縄は大きくてコードがバラバラなので指定しちゃえ
      if (userAddress.value === "沖縄県") {
        weatherPlaceCode = "471000";
      } else if (userAddress.value === "北海道") {
        weatherPlaceCode = "013000";
      }

      const response2 = await axios.get(
        `https://www.jma.go.jp/bosai/forecast/data/forecast/${weatherPlaceCode}.json`
      );
      weather.value = response2.data[0].timeSeries[0].areas[0].weathers[1];
    });

    return {
      sayHallo,
      weather,
      weatherPlace,
      userAddress,
      userName,
      prefectures,
    };
    //setup
  },
});
</script>

<style scoped>
.all {
  display: flex;
  margin-left: 20%;
  font-family: "Shippori Mincho", serif;
}

.toragaoImg {
  width: 300px;
}
.message {
  text-align: center;
  margin-top: 100px;
  margin-left: 100px;
}

.address {
  text-align: center;
}
</style>

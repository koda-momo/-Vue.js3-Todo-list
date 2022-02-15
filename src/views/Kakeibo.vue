<template>
  <div>
    <!-- 始め -->
    <div class="pageTitle">
      <h1>{{ nowYear }}年{{ nowMonth }}月家計簿</h1>
      <p>{{ nowMonth }}月1日～{{ nowMonth }}月{{ nowEndDate }}日</p>
      <div class="main">
        <div class="item">
          <div class="title">収入</div>
          ￥{{ nowIn.toLocaleString() }}
        </div>
        <div class="item">-</div>
        <div class="item">
          <div class="title">支出</div>
          ￥{{ nowOut.toLocaleString() }}
        </div>
        <div class="item">-</div>
        <div class="item">
          <div class="title">貯金</div>
          ￥{{ nowSaving.toLocaleString() }}
        </div>
        <div class="item">=</div>
        <div class="item">
          <div class="title">収支</div>
          ￥{{ totalPrice.toLocaleString() }}
        </div>
      </div>
    </div>

    <!-- ボタンのコーナー -->
    <div class="btnbtn">
      <span class="out" v-on:click="inOutFlug = false"
        ><button
          type="button"
          :class="{ onswitch: !inOutFlug, offswitch: inOutFlug }"
        >
          支出
        </button></span
      >
      <span class="in" v-on:click="inOutFlug = true"
        ><button
          type="button"
          :class="{ onswitch: inOutFlug, offswitch: !inOutFlug }"
        >
          収入
        </button></span
      >
    </div>

    <!-- グラフのコーナー(支出)-->
    <div class="chartZone">
      <div class="wrapper" id="pieChart2" v-show="!inOutFlug">
        <PieChart :chartData="pieData2" />
      </div>

      <!-- グラフのコーナー(収入) -->
      <div class="wrapper" id="pieChart1" v-show="inOutFlug">
        <PieChart :chartData="pieData1" />
      </div>
    </div>

    <hr />

    <!-- カテゴリごとの表のコーナー(収入) -->
    <div v-show="inOutFlug">
      <table v-for="inItem of inArray" :key="inItem" class="tableTable">
        <tr class="tableTr">
          <td>
            <i :class="`${inItem.mark}`" :style="{ color: inItem.color }"></i>
          </td>
          <th>
            {{ inItem.category }}
          </th>
          <td>￥{{ Number(inItem.price).toLocaleString() }}</td>
        </tr>
      </table>
    </div>

    <!-- カテゴリごとの表のコーナー(支出) -->
    <div v-show="!inOutFlug">
      <table v-for="outItem of outArray" :key="outItem" class="tableTable">
        <tr class="tableTr">
          <td>
            <i :class="`${outItem.mark}`" :style="{ color: outItem.color }"></i>
          </td>
          <th>
            {{ outItem.category }}
          </th>
          <td>￥{{ Number(outItem.price).toLocaleString() }}</td>
        </tr>
      </table>
    </div>

    <!-- 終わり -->
  </div>
</template>

<script lang="ts">
/**
 * 家計簿のページ.
 */
import { Chart, ChartData, registerables } from "chart.js";
import { PieChart } from "vue-chart-3";
import { defineComponent, reactive, ref, watchEffect, computed } from "vue";
import { useStore } from "vuex";
import { endOfMonth } from "date-fns";
Chart.register(...registerables);
export default defineComponent({
  components: {
    PieChart,
  },

  setup() {
    let response: any;
    //storeを利用
    const store = useStore();
    //今月の値を取得
    const nowMonth = store.getters.getNowMonth;
    //今年の値を取得
    const nowYear = store.getters.getNowYear;
    //今月の月末日
    const nowEndDate = endOfMonth(new Date()).getDate();
    //今月の収入
    let nowIn = ref(0);
    //今月の支出
    let nowOut = ref(0);
    //今月の貯金額
    let nowSaving = ref(0);
    //今月の残金
    let totalPrice = ref(0);
    //支出／収入グラフの切替
    const inOutFlug = ref(false);

    const inArray = ref(new Array<any>());
    const outArray = ref(new Array<any>());

    let categoryData: any;
    //収入データ円グラフ初期値
    const pieData1: ChartData<"pie"> = {
      labels: [],
      datasets: [
        {
          label: "inData",
          data: [],
          backgroundColor: [],
          hoverOffset: 4,
        },
      ],
    };

    //支出円グラフ初期値
    let pieData2: ChartData<"pie"> = reactive({
      labels: [],
      datasets: [
        {
          label: "outData",
          data: [],
          backgroundColor: [],
          hoverOffset: 4,
        },
      ],
    });

    /**
     * 画面上部のデータを形成.
     */
    const calcOutPrice = (data: any) => {
      response = data;
      //収入
      for (const inPrice of response[nowMonth].in) {
        nowIn.value = nowIn.value + Number(inPrice.price);
      }

      //変動費+固定費を算出
      let totalKoteiPrice = 0;
      for (const data of response[nowMonth].out) {
        totalKoteiPrice += Number(data.price);
      }
      for (const data of response.kotei) {
        totalKoteiPrice += Number(data.price);
      }
      nowOut.value = totalKoteiPrice;

      //貯金額
      nowSaving.value = 10000;
      //トータル金額
      totalPrice.value = nowIn.value - nowOut.value - nowSaving.value;
    };

    /**
     * DBからユーザの収支情報を取得.
     */
    const getData = async () => {
      await store.dispatch("getCategoryInfo");
      categoryData = store.getters.getCategoryInfo;
      await store.dispatch("getMoneyInfo", "yamada@aaa");
      const data = store.getters.getMoneyInfo;
      calcOutPrice(data);
    };

    getData();

    /**
     * 円グラフを形成.
     */
    watchEffect(() => {
      //トータルプライスの値が変わったら発動
      totalPrice.value;
      categoryData;
      //もしデータがまだ来ていなかったらreturn
      if (response === undefined || categoryData === "") {
        return;
      }

      //収入データ円グラフ
      const array1 = new Array<any>();
      const categoryArray1 = ref(new Array<string>());
      const priceArray1 = ref(new Array<number>());
      const colorArray1 = new Array<string>();
      const markArray1 = ref(new Array<string>());

      //カテゴリ名とその価格をpush{category:XX,price:XX}
      for (const responseItem of response[nowMonth].in) {
        array1.push({
          category: String(responseItem.category),
          price: Number(responseItem.price),
        });
      }

      //カテゴリ名が被っていたら価格を合わせて排除
      for (let i = 0; i < array1.length; i++) {
        let answer = array1[i].price;
        for (let j = i + 1; j < array1.length; j++) {
          if (array1[i].category === array1[j].category) {
            answer = answer + array1[j].price;
            array1.splice(array1[j], 1);
          }
        }
        priceArray1.value.push(answer);
        categoryArray1.value.push(array1[i].category);
      }

      //円グラフデータに作成した配列データを格納
      pieData1.labels = categoryArray1.value;
      pieData1.datasets[0].data = priceArray1.value;

      //グラフの色作成
      for (const category1 of categoryArray1.value) {
        for (const category2 of categoryData) {
          if (category1 === category2.name) {
            colorArray1.push(category2.color);
            markArray1.value.push(category2.mark);
          }
        }
      }
      pieData1.datasets[0].backgroundColor = colorArray1;

      for (let i = 0; i < categoryArray1.value.length; i++) {
        inArray.value.push({
          category: categoryArray1.value[i],
          price: priceArray1.value[i],
          mark: markArray1.value[i],
          color: colorArray1[i],
        });
      }

      //支出データ円グラフ
      const array2 = new Array<any>();
      const categoryArray2 = ref(new Array<string>());
      const priceArray2 = ref(new Array<number>());
      const colorArray2 = new Array<string>();
      const markArray2 = ref(new Array<string>());

      for (const responseItem of response[nowMonth].out) {
        array2.push({
          category: String(responseItem.category),
          price: Number(responseItem.price),
        });
      }

      for (const responseItem of response.kotei) {
        array2.push({
          category: String(responseItem.category),
          price: Number(responseItem.price),
        });
      }

      for (let i = 0; i < array2.length; i++) {
        let answer = array2[i].price;
        for (let j = i + 1; j < array2.length; j++) {
          if (array2[i].category === array2[j].category) {
            answer = answer + array2[j].price;
            array2.splice(array2[j], 1);
          }
        }
        priceArray2.value.push(Number(answer));
        categoryArray2.value.push(array2[i].category);
      }

      pieData2.labels = categoryArray2.value;
      pieData2.datasets[0].data = priceArray2.value;

      for (const category1 of categoryArray2.value) {
        for (const category2 of categoryData) {
          if (category1 === category2.name) {
            colorArray2.push(category2.color);
            markArray2.value.push(category2.mark);
          }
        }
      }
      pieData2.datasets[0].backgroundColor = colorArray2;

      for (let i = 0; i < categoryArray2.value.length; i++) {
        outArray.value.push({
          mark: markArray2.value[i],
          category: categoryArray2.value[i],
          price: priceArray2.value[i],
          color: colorArray2[i],
        });
      }
    });

    return {
      inOutFlug,
      pieData1,
      pieData2,
      nowMonth,
      nowIn,
      nowOut,
      nowSaving,
      totalPrice,
      nowYear,
      nowEndDate,
      inArray,
      outArray,
    };
  },
});
</script>

<style scoped>
.pageTitle {
  background-color: rgb(245, 245, 245);
  text-align: center;
  border-bottom: 1px solid rgb(187, 187, 187);
}

.main {
  display: flex;
  margin: 20px auto 20px 23%;
}

.item {
  margin-left: 50px;
}

.chartZone {
  margin-left: 35%;
}

#pieChart1,
#pieChart2 {
  width: 50%;
}

.tableTable {
  width: 30%;
  margin-left: 37%;
}

.tableTr {
  border-bottom: solid 1px rgb(145, 145, 145);
}

.tableTr td,
.tableTr th {
  text-align: center;
  width: 30%;
}

i {
  padding: 6px 5px 5px 7px;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin-right: 20px;
}

.btnbtn {
  text-align: center;
}

.onswitch {
  border: none;
  border-radius: 100px;
  background-color: rgb(150, 150, 150);
  margin: 10px;
  outline: none;
}
.offswitch {
  border: none;
  border-radius: 100px;
  background-color: rgb(255, 255, 255);
  margin: 10px;
  outline: none;
}
</style>

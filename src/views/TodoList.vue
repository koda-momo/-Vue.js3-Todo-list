<template>
  <div>
    <!-- 始め -->

    <div class="newTodo">
      <span style="color: red">{{ error }}</span>
      <form>
        <div>項目名：<input type="text" v-model="todo" /></div>
        <div>開始日：<input type="date" v-model="startDate" /></div>
        <div>終了日：<input type="date" v-model="endDate" /></div>
        <button type="button" v-on:click="addTodo" class="btn btn-secondary">
          追加
        </button>
      </form>
    </div>
    <hr />
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>12月</th>
          <td v-for="date of dateArray" :key="date">{{ date }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="gant of gantArray" :key="gant">
          <th>{{ gant.name }}</th>
          <td
            v-for="hana of gant.hana"
            :key="hana"
            style="color: rgb(163, 97, 22)"
          >
            {{ hana }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 終わり -->
  </div>
</template>

<script lang="ts">
/**
 * Todoリストページ.
 */
import { defineComponent, ref } from "vue";
import { endOfMonth } from "date-fns";
export default defineComponent({
  setup() {
    //今月の月末日
    const nowEndDate = endOfMonth(new Date()).getDate();

    //todoリスト
    const todoArray = ref(new Array<string>());
    //todo1つ1つ
    const todo = ref("");
    //終わったものが入る
    const finishList = ref(new Array<string>());

    //予定の初めの日
    const startDate = ref("");
    //予定の終わりの日
    const endDate = ref("");
    //ガントチャート用配列
    const gantArray = ref(new Array<any>());
    //エラー表示用
    let error = ref("");

    /**
     * カレンダーに登録するtodo配列を作成.
     */
    const makeArray = () => {
      //お花入れる用配列
      const array = new Array<string>();
      //エラーを初期化
      error.value = "";

      //予定の始め
      let start = new Date(startDate.value).getDate() - 1;
      //予定の終わり
      let end = new Date(endDate.value).getDate() - 1;

      //始めの日よりも終わりの日が前だったらエラー
      if (
        new Date(startDate.value) > new Date(endDate.value) ||
        todo.value === ""
      ) {
        error.value = "予定の始めは終わりよりも前に設定して下さい";
        return;
      }

      //今月に予定が被っていなければ空白をpush
      //始めが先月より前&&終わりが今よりも前 || 始めが先月より後&&終わりが今よりも後
      if (
        (new Date(startDate.value) > new Date() &&
          new Date(endDate.value) > new Date()) ||
        (new Date(startDate.value) < new Date() &&
          new Date(endDate.value) < new Date())
      ) {
        if (
          (new Date(startDate.value).getMonth() != new Date().getMonth() ||
            new Date(startDate.value).getFullYear() !=
              new Date().getFullYear()) &&
          (new Date(endDate.value).getMonth() != new Date().getMonth() ||
            new Date(endDate.value).getFullYear() != new Date().getFullYear())
        ) {
          start = -1;
          array.push(" ");
        }
      }

      //入力した終わりの日が来月以降の場合、月末まで塗つぶす
      if (new Date(endDate.value) > new Date()) {
        if (
          new Date(endDate.value).getMonth() != new Date().getMonth() ||
          new Date(endDate.value).getFullYear() != new Date().getFullYear()
        ) {
          end = nowEndDate - 1;
        }
      }
      //入力した始めの日が先月以前の場合、月初から塗つぶす
      if (new Date(startDate.value) < new Date()) {
        if (
          new Date(startDate.value).getMonth() != new Date().getMonth() ||
          new Date(startDate.value).getFullYear() != new Date().getFullYear()
        ) {
          start = 0;
        }
      }

      //-1の際と日付がnullの場合は塗つぶす必要なし
      if (start != -1 && startDate.value != "" && endDate.value != "") {
        for (let i = start; i <= end; i++) {
          array[i] = "❁";
        }
        for (let i = end + 1; i <= nowEndDate; i++) {
          array.push(" ");
        }
      } else {
        for (let i = 0; i <= nowEndDate; i++) {
          array.push(" ");
        }
      }
      //予定用の配列に名前とお花の配列を入れる
      gantArray.value.push({ name: todo.value, hana: array });

      //要素を空にする
      todo.value = "";
      finishList.value.splice(0, finishList.value.length);
      startDate.value = "";
      endDate.value = "";
    };

    /**
     * カレンダーに登録するtodoを追加.
     */
    const addTodo = () => {
      error.value = "";
      //空欄だったらエラー
      if (todo.value === "") {
        error.value = "予定を入力して下さい";
        return;
      }
      // todoArray.value.push(todo.value);
      //予定の配列作成
      makeArray();
    };

    //カレンダーの日付作成
    const dateArray = ref(new Array<number>());
    const makeDateArray = () => {
      for (let i = 1; i <= nowEndDate; i++) {
        dateArray.value.push(i);
      }
    };

    makeDateArray();

    return {
      todo,
      todoArray,
      addTodo,
      finishList,
      dateArray,
      gantArray,
      startDate,
      endDate,
      error,
      nowEndDate,
    };

    //setup
  },
});
</script>

<style scoped>
.newTodo {
  text-align: center;
}

.newTodo input {
  margin: 10px;
}

.todo {
  margin-left: 40%;
  margin-top: 30px;
}

table {
  text-align: center;
  margin-left: 10px;
}

th {
  width: 200px;
}

td {
  width: 50px;
  padding-left: 0;
  padding-right: 0;
  text-align: center;
}

.table {
  width: 90%;
  margin-left: 5%;
}
</style>

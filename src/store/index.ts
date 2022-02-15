import axios from "axios";
import { createStore } from "vuex";

export default createStore({
  strict: true,
  state: {
    moneyInfo: new Array<string>(),
    nowMonth: new Date().getMonth() + 1,
    nowYear: new Date().getFullYear(),
    categoryInfo: new Array<string>(),
  },
  mutations: {
    /**
     * 収支情報をstateに追加.
     * @param state - ステート
     * @param payload - ユーザ情報
     */
    addMoneyInfo(state, payload) {
      state.moneyInfo[state.nowMonth] = payload;
    },
    /**
     * ログイン中ユーザの情報をstateに格納.
     * @param state - ステート
     * @param payload - ユーザ情報
     */
    showMoneyInfo(state, payload) {
      state.moneyInfo = payload;
    },
    /**
     * カテゴリ情報をstateに格納.
     * @param state - ステート
     * @param payload - カテゴリ情報
     */
    showCategoryInfo(state, payload) {
      state.categoryInfo = payload;
    },
  },
  actions: {
    /**
     * ユーザ情報取得.
     * @param context - コンテキスト
     * @param mailAddress - ログイン中ユーザのメールアドレス
     */
    async getMoneyInfo(context, mailAddress) {
      const response = await axios.get(
        `https://kakeibo-ccae1-default-rtdb.firebaseio.com/user/${mailAddress}.json`
      );
      const payload = response.data;
      context.commit("showMoneyInfo", payload);
    },

    /**
     * カテゴリ情報
     * @param context
     */
    async getCategoryInfo(context) {
      const response = await axios.get(
        `https://kakeibo-ccae1-default-rtdb.firebaseio.com/category.json`
      );
      const payload = response.data;
      context.commit("showCategoryInfo", payload);
    },

    //アクション図
  },

  modules: {},
  getters: {
    getNowMonth(state) {
      return state.nowMonth;
    },
    getNowYear(state) {
      return state.nowYear;
    },
    getMoneyInfo(state) {
      return state.moneyInfo;
    },
    getCategoryInfo(state) {
      return state.categoryInfo;
    },
  },
});

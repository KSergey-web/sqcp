<template>
  <v-card tile class="mt-12">
    <v-card-title> Server management </v-card-title>
    <v-card-text>
      <v-list three-line subheader>
        <v-list-item>
          <v-list-item-content>
            <v-btn @click="restartService()"> Перезапуск службы сервера squad (только службы)</v-btn>
            Последний запуск команды: {{ statistics.lastRestartServiceDate }}
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-btn @click="updateService()">
              Перезапуск службы с проверкой обновлений серверной части сквада, и перезапуском squadjs</v-btn
            >
            Последний запуск команды: {{ statistics.lastUpdateServiceDate }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'ServerManagement',

  data() {
    return {
      statistics: {
        lastRestartServiceDate: 'Loading...',
        lastUpdateServiceDate: 'Loading...',
      },
    };
  },

  async beforeCreate() {
    try {
      await this.$store.dispatch('serverManagementStatistics/fetch');
      const res = this.$store.getters['serverManagementStatistics/getStatistics'];
      this.updateState(res);
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: 'Failed to fetch the statistics!',
      });
      this.statistics = {
        lastRestartServiceDate: 'Не удалось загрузить информацию',
        lastUpdateServiceDate: 'Не удалось загрузить информацию',
      };
    }
  },

  methods: {
    async confirmAction(action) {
      return new Promise((resove) => {
        this.$swal({
          title: `Do you really want to ${action}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, I do',
        }).then((result) => resove(result.isConfirmed));
      });
    },

    handleError(error) {
      if (error.response) {
        //console.log('Error: ', error.response);

        this.$swal({
          icon: 'error',
          title: `${error.response.data.error}`,
        });
      } else if (error.request) {
        //console.log('Error: ', error.request);

        this.$swal({
          icon: 'error',
          title: 'Unable to connect to the server!',
        });
      } else {
        // Something happened in setting up of the request that triggered an Error
        console.error(error);

        this.$swal({
          icon: 'error',
          title: 'Code error, open the console for more info!',
        });
      }

      return false;
    },

    async doUpdateServer() {
      try {
        const result = await Vue.axios.post(
          `${Vue.config.baseURL}/server-management/update-and-restart`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$store.getters['session/getToken']}`,
            },
          }
        );
        this.$swal({
          icon: 'success',
          title: `Succesfully run update and restart`,
        });
        this.updateState(result.data.statistics);
      } catch (error) {
        this.handleError(error);
      }
    },

    updateState(statistics) {
      this.statistics = {};
      if (statistics.lastRestartServiceDate) {
        this.statistics.lastRestartServiceDate = this.getDateWithTime(statistics);
      } else {
        this.statistics.lastRestartServiceDate = 'Команда не запускалась';
      }
      if (statistics.lastUpdateServiceDate) {
        this.statistics.lastUpdateServiceDate = this.getDateWithTime(statistics);
      } else {
        this.statistics.lastUpdateServiceDate = 'Команда не запускалась';
      }
    },

    async doRestartServer() {
      try {
        const result = await Vue.axios.post(
          `${Vue.config.baseURL}/server-management/restart`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$store.getters['session/getToken']}`,
            },
          }
        );
        this.$swal({
          icon: 'success',
          title: `Succesfully run restart`,
        });
        this.updateState(result.data.statistics);
      } catch (error) {
        this.handleError(error);
      }
    },

    async restartService() {
      if (await this.confirmAction('Перезапуск службы сервера squad (только службы)')) {
        await this.doRestartServer();
      }
    },

    async updateService() {
      if (
        await this.confirmAction(
          'Перезапуск службы с проверкой обновлений серверной части сквада, и перезапуском squadjs'
        )
      ) {
        await this.doUpdateServer();
      }
    },

    getDateWithTime(date) {
      let formatter = new Intl.DateTimeFormat('ru', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });

      return formatter.format(date);
    },
  },
};
</script>

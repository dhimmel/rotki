<template>
  <div v-if="displayed" class="login">
    <v-card-title>
      {{ $t('login.title') }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="username"
          autofocus
          class="login__fields__username"
          color="secondary"
          :label="$t('login.label_username')"
          prepend-icon="mdi-account"
          validate-on-blur
          :rules="usernameRules"
          :disabled="loading || !!syncConflict.message"
          required
        />

        <revealable-input
          v-model="password"
          :rules="passwordRules"
          :disabled="loading || !!syncConflict.message"
          type="password"
          required
          class="login__fields__password"
          color="secondary"
          :label="$t('login.label_password')"
          prepend-icon="mdi-lock"
          @keypress.enter="login()"
        />

        <transition name="bounce">
          <v-alert
            v-if="!!syncConflict.message"
            class="login__sync-error"
            text
            prominent
            outlined
            type="info"
            icon="fa-cloud-download"
          >
            <h3 class="login__sync-error__header">
              {{ $t('login.sync_error.title') }}
            </h3>
            <div class="login__sync-error__body mt-2">
              <div>
                <div>{{ syncConflict.message }}</div>
                <ul class="mt-2">
                  <li>
                    <i18n path="login.sync_error.local_modified">
                      <div class="font-weight-medium">
                        {{ localLastModified }}
                      </div>
                    </i18n>
                  </li>
                  <li class="mt-2">
                    <i18n path="login.sync_error.remote_modified">
                      <div class="font-weight-medium">
                        {{ remoteLastModified }}
                      </div>
                    </i18n>
                  </li>
                  <li class="mt-2">
                    <i18n path="login.sync_error.local_size">
                      <div class="font-weight-medium">
                        {{ localSize }}
                      </div>
                    </i18n>
                  </li>
                  <li class="mt-2">
                    <i18n path="login.sync_error.remote_size">
                      <div class="font-weight-medium">
                        {{ remoteSize }}
                      </div>
                    </i18n>
                  </li>
                </ul>
              </div>
              <div class="mt-2">{{ $t('login.sync_error.question') }}</div>
            </div>

            <v-row no-gutters justify="end" class="mt-2">
              <v-col cols="3" class="shrink">
                <v-btn color="error" depressed @click="login('no')">
                  {{ $t('login.sync_error.button_no') }}
                </v-btn>
              </v-col>
              <v-col cols="3" class="shrink">
                <v-btn color="success" depressed @click="login('yes')">
                  {{ $t('login.sync_error.button_yes') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </transition>
      </v-form>
    </v-card-text>
    <v-card-actions class="login__actions d-block">
      <span>
        <v-btn
          class="login__button__sign-in"
          depressed
          color="primary"
          :disabled="!valid || loading || !!syncConflict.message"
          :loading="loading"
          @click="login()"
        >
          {{ $t('login.button_signin') }}
        </v-btn>
      </span>
      <v-divider class="my-3" />
      <span class="login__actions__footer">
        <a
          class="login__button__new-account font-weight-bold secondary--text"
          @click="newAccount()"
        >
          {{ $t('login.button_new_account') }}
        </a>
      </span>
    </v-card-actions>
  </div>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import RevealableInput from '@/components/inputs/RevealableInput.vue';
import { SyncConflict } from '@/store/session/types';
import { Credentials, SyncApproval } from '@/typing/types';

@Component({
  components: { RevealableInput }
})
export default class Login extends Vue {
  @Prop({ required: true })
  displayed!: boolean;

  @Prop({ required: true, type: Boolean })
  loading!: boolean;

  @Prop({ required: true })
  syncConflict!: SyncConflict;

  get localLastModified(): string {
    return this.syncConflict.payload?.localLastModified ?? '';
  }

  get remoteLastModified(): string {
    return this.syncConflict.payload?.remoteLastModified ?? '';
  }

  get localSize(): string {
    return this.syncConflict.payload?.localSize ?? '';
  }

  get remoteSize(): string {
    return this.syncConflict.payload?.remoteSize ?? '';
  }

  @Watch('displayed')
  onDisplayChange() {
    this.username = '';
    this.password = '';
    const form = this.$refs.form as any;

    if (form) {
      form.reset();
    }
  }

  username: string = '';
  password: string = '';

  valid = false;

  readonly usernameRules = [
    (v: string) => !!v || this.$t('login.validation.non_empty_username'),
    (v: string) =>
      (v && /^[0-9a-zA-Z_.-]+$/.test(v)) ||
      this.$t('login.validation.valid_username')
  ];

  readonly passwordRules = [
    (v: string) => !!v || this.$t('login.validation.non_empty_password')
  ];

  login(syncApproval: SyncApproval = 'unknown') {
    const credentials: Credentials = {
      username: this.username,
      password: this.password,
      syncApproval
    };
    this.$emit('login', credentials);
  }

  @Emit()
  newAccount() {}
}
</script>

<style scoped lang="scss">
.login {
  &__actions {
    &__footer {
      font-size: 0.9em;
    }

    span,
    button {
      display: block;
      width: 100%;
      text-align: center;
    }
  }

  &__sync-error {
    &__body {
      margin-top: 5px;
      margin-bottom: 8px;
    }
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>

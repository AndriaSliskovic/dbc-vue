<template>
  <v-app id="inspire">
    <v-card>
      <v-card-title>
        <v-col cols="6">
          <h3>Feature manager</h3>
        </v-col>
        <v-col cols="6">
          <NotificationContainer />
        </v-col>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-col>
              <form>
                <!-- COMPANY -->
                <v-select
                  :items="feature.companies"
                  name="company"
                  item-text="CompanyName"
                  filled
                  return-object
                  label="Company"
                  hint="Select company"
                  persistent-hint
                  v-model="selectedCompany"
                  @change="setSelectedCompany"
                ></v-select>
              </form>
            </v-col>
            <!-- SETTINGS -->
            <v-col>
              <!-- Select options -->
              <v-select
                :items="selectOptions"
                name="group"
                item-text="name"
                item-value="key"
                filled
                label="Settings"
                hint="Select portal or user group"
                persistent-hint
                v-model="settingsType"
                @change="onSettingsTypeChange"
                :disabled="isSettingsDisabled"
              ></v-select>
            </v-col>
            <v-col v-if="settingsType==='group'">
              <!-- Select usr group -->
                <v-select
                  :items="feature.groups"
                  name="group"
                  item-text="name"
                  item-value="guid"
                  filled
                  label="User Groups"
                  hint="Select a user group"
                  persistent-hint
                  v-model="selectedGroupGuid"
                  @change="onSelectedGroupChange"
                ></v-select>
            </v-col>
          </v-col>
          <!-- IF PORTAL IS SELECTED -->
          <v-col cols="6" v-if="settingsType==='portal'">
            <FeatureContainer
              :currentFeatures="currentFeatures"
              @updateModules="featuresIds=$event"
              :selCompany="selectedCompany"
            />
          </v-col>
          <!-- IF USERS GROUP -->
          <v-col cols="6" v-if="settingsType==='group'">
            <FeatureContainer
              :currentFeatures="currentFeatures"
              @updateModules="featuresIds=$event"
            />
              <!-- <FeatureDetail :currentFeatures="currentFeatures" @updateModules="featuresIds=$event"></FeatureDetail> -->
          </v-col>
        </v-row>

        <template v-if="selectedCompany">
          <v-col>
            <div v-if="settingsType==='portal'">
              <FeatureDetail :currentFeatures="currentFeatures" @updateModules="featuresIds=$event"></FeatureDetail>
            </div>
            <!-- IF SELECTED GROUP -->
            <div v-if="settingsType==='group'">
              <form>
                <FeatureDetail
                  :currentFeatures="currentFeatures"
                  @updateModules="featuresIds=$event"
                ></FeatureDetail>
              </form>
            </div>
          </v-col>

          <!-- SUBMIT BUTTON -->
          <v-card-actions>
            <v-row justify="center">
              <v-btn color="error" @click.prevent="submitted" :disabled="isSaveButtonDisabled">Save</v-btn>
            </v-row>
          </v-card-actions>
        </template>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
import NProgress from 'nprogress'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import FeatureDetail from './FeatureDetail'
import NotificationContainer from '../../components/NotificationContainer'
import FeatureCard from './FeatureCard'
import FeatureContainer from './FeatureContainer'

export default {
  data() {
    return {
      companies: null,
      featuresIds: [],
      currentFeatures: [],
      selectedCompany: null,
      selectedGroupGuid: null,
      settingsType: null,
      isSubmited: false,
      selectOptions: [
        {
          key: 'portal',
          name: 'Portal'
        },
        {
          key: 'group',
          name: 'User Group'
        }
      ]
    }
  },
  components: {
    FeatureDetail,
    NotificationContainer,
    FeatureContainer
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store
      .dispatch('feature/loadPortals')
      .then(store.dispatch('feature/LoadAllModules'))
      .then(response => {
        next()
      })
  },
  computed: {
    ...mapState({ feature: 'feature' }),
    subscribedEntityId: function() {
      if (this.settingsType === 'portal') {
        return this.selectedCompany.CompanyGUID
      } else {
        return this.selectedGroupGuid
      }
    },
    portalId: function() {
      return this.selectedCompany.CompanyId
    },
    isSaveButtonDisabled: function() {
      return !this.settingsType || !this.feature.selectedModules
    },
    isSettingsDisabled: function() {
      return !this.selectedCompany
    }
  },
  created() {
    this.companies = this.feature.companies
  },
  methods: {
    onUserGroupSelect() {
      console.log("selektovana grupa")
      this.clearPreviousUserGroupSelection()
      store.dispatch('feature/getCompanyGroups', this.selectedCompany.CompanyId)
      if (this.selectedGroupGuid) {
        console.log("onUserGroupSelect true")
        store.dispatch('feature/cleanModules')
        store
          .dispatch('feature/getSelectedModules', this.selectedGroupGuid)
          .then(() => {
            this.generateFeatureCheckboxes()
          })
      } else {
                console.log("onUserGroupSelect false")
        store.dispatch('feature/cleanModules')
        // .then(() => {
        //   this.generateFeatureCheckboxes()
        // })
      }
    },
        onSelectedGroupChange() {
   
      console.log("selektovana user grupa","popunjava checkboxeve")
      store
        .dispatch('feature/getSelectedModules', this.selectedGroupGuid)
        .then(() => {
          this.generateFeatureCheckboxes()
        })
    },
    onPortalSelect() {
      console.log("selektovan portal")
      store
        .dispatch(
          'feature/getSelectedModules',
          this.selectedCompany.CompanyGUID
        )
        .then(() => {
          this.generateFeatureCheckboxes()
        })
    },
    setSelectedCompany() {
      this.settingsType = null
      store.dispatch('feature/cleanModules')
      store.dispatch(
        'feature/selectedCompanyGuid',
        this.selectedCompany.CompanyGUID
      )
    },
    onSettingsTypeChange() {
      switch (this.settingsType) {
        case 'portal':
          this.onPortalSelect()
          break
        case 'group':
          this.onUserGroupSelect()
          break
        case 'userGroup':
          this.onUserGroupSelect()
          break          
        default:
          this.settingsType = null
          break
      }
    },

    generateFeatureCheckboxes() {
      console.log("generise boxeve")
      const initialModules = this.feature.initialModules
      const currentFeatureNames = this.feature.selectedModules
        ? this.feature.selectedModules
        : []
      this.currentFeatures = initialModules.map(function(el) {
        el.selected = currentFeatureNames.includes(el.name)
        return el
      })
    },
    makeFeatureIdsArray() {
      this.featuresIds = this.currentFeatures
        .filter(e => e.selected === true)
        .map(el => el.id)
    },

    makeRequestObject() {
      return {
        subscribedEntityId: this.subscribedEntityId,
        moduleIds: this.featuresIds
      }
    },
    submitted() {
      this.isSubmited = true
      if (!this.featuresIds.length) {
        this.makeFeatureIdsArray()
      }
      store.dispatch('feature/selectedModules', this.featuresIds)
      store.dispatch('feature/submitForm', this.makeRequestObject())
    },
    reloadPage() {
      window.location.reload()
    },
    clearPreviousUserGroupSelection() {
      this.selectedGroupGuid = null
    }
  }
}
</script>

<style>
</style>

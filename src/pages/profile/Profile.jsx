import React, { useEffect, useState } from 'react';
import BreadCumb from '../../components/common/breadCumb/BreadCumb';
import { apiRequest } from '../../services/Api';
import { API_ROUTES } from '../../routes/api.routes';
import ProfileForm from './ProfileForm';
import ChangePassword from '../auth/login/pages/ChangePassword';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [genderData, setGenderData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [communicationData, setCommunicationData] = useState([]);
  const [isOpenChangePassword, setisOpenChangePassword] = useState(false);
  const [roleData, setRoleData] = useState([]);

  const fetchProfile = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.user.getUserProfile,
      null,
      null,
      {
        useToken: true,
        showLoader: true,
      }
    );
    setUserProfile(res.data);
  };

  const fetchGender = async () => {
    const res = await apiRequest('GET', API_ROUTES.common.gender, null, null, {
      useToken: true,
      showLoader: true,
    });
    setGenderData(res.data);
  };

  const fetchCountry = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.common.getCountry,
      null,
      null,
      {
        useToken: true,
        showLoader: true,
      }
    );
    setCountryData(res.data);
  };

  const fetchCommunication = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.common.communicationWithDropdown,
      null,
      null,
      {
        useToken: true,
        showLoader: true,
      }
    );
    setCommunicationData(res.data);
  };

  const fetchRoleData = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.role.getRolesForDropdown,
      null,
      null,
      {
        useToken: true,
        showLoader: true,
      }
    );
    setRoleData(res.data);
  };

  useEffect(() => {
    fetchProfile();
    fetchGender();
    fetchCountry();
    fetchCommunication();
    fetchRoleData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="tabbar-section">
        <div className="row">
          <div className="col-12">
            <BreadCumb items={[{ label: 'My Profile' }]} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <ProfileForm
              isOpenChangePassword={isOpenChangePassword}
              setisOpenChangePassword={setisOpenChangePassword}
              userProfile={userProfile}
              genderData={genderData}
              countryData={countryData}
              communicationData={communicationData}
              roleData={roleData}
              refreshProfile={fetchProfile}
            />
          </div>
        </div>
      </div>
      {isOpenChangePassword && (
        <ChangePassword
          userProfile={userProfile}
          setisOpenChangePassword={setisOpenChangePassword}
        />
      )}
    </div>
  );
}

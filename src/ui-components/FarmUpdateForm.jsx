/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getFarm } from "../graphql/queries";
import { updateFarm } from "../graphql/mutations";
const client = generateClient();
export default function FarmUpdateForm(props) {
  const {
    id: idProp,
    farm: farmModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    ownerSub: "",
    name: "",
    farmType: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    acres: "",
    establishedYear: "",
    website: "",
    businessRegistration: "",
    taxId: "",
    phoneNumber: "",
    email: "",
    isActive: false,
    createdAt: "",
    updatedAt: "",
  };
  const [ownerSub, setOwnerSub] = React.useState(initialValues.ownerSub);
  const [name, setName] = React.useState(initialValues.name);
  const [farmType, setFarmType] = React.useState(initialValues.farmType);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [address, setAddress] = React.useState(initialValues.address);
  const [city, setCity] = React.useState(initialValues.city);
  const [state, setState] = React.useState(initialValues.state);
  const [zipCode, setZipCode] = React.useState(initialValues.zipCode);
  const [country, setCountry] = React.useState(initialValues.country);
  const [acres, setAcres] = React.useState(initialValues.acres);
  const [establishedYear, setEstablishedYear] = React.useState(
    initialValues.establishedYear
  );
  const [website, setWebsite] = React.useState(initialValues.website);
  const [businessRegistration, setBusinessRegistration] = React.useState(
    initialValues.businessRegistration
  );
  const [taxId, setTaxId] = React.useState(initialValues.taxId);
  const [phoneNumber, setPhoneNumber] = React.useState(
    initialValues.phoneNumber
  );
  const [email, setEmail] = React.useState(initialValues.email);
  const [isActive, setIsActive] = React.useState(initialValues.isActive);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = farmRecord
      ? { ...initialValues, ...farmRecord }
      : initialValues;
    setOwnerSub(cleanValues.ownerSub);
    setName(cleanValues.name);
    setFarmType(cleanValues.farmType);
    setDescription(cleanValues.description);
    setAddress(cleanValues.address);
    setCity(cleanValues.city);
    setState(cleanValues.state);
    setZipCode(cleanValues.zipCode);
    setCountry(cleanValues.country);
    setAcres(cleanValues.acres);
    setEstablishedYear(cleanValues.establishedYear);
    setWebsite(cleanValues.website);
    setBusinessRegistration(cleanValues.businessRegistration);
    setTaxId(cleanValues.taxId);
    setPhoneNumber(cleanValues.phoneNumber);
    setEmail(cleanValues.email);
    setIsActive(cleanValues.isActive);
    setCreatedAt(cleanValues.createdAt);
    setUpdatedAt(cleanValues.updatedAt);
    setErrors({});
  };
  const [farmRecord, setFarmRecord] = React.useState(farmModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getFarm.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getFarm
        : farmModelProp;
      setFarmRecord(record);
    };
    queryData();
  }, [idProp, farmModelProp]);
  React.useEffect(resetStateValues, [farmRecord]);
  const validations = {
    ownerSub: [{ type: "Required" }],
    name: [{ type: "Required" }],
    farmType: [],
    description: [],
    address: [],
    city: [],
    state: [],
    zipCode: [],
    country: [],
    acres: [],
    establishedYear: [],
    website: [],
    businessRegistration: [],
    taxId: [],
    phoneNumber: [],
    email: [],
    isActive: [{ type: "Required" }],
    createdAt: [],
    updatedAt: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          ownerSub,
          name,
          farmType: farmType ?? null,
          description: description ?? null,
          address: address ?? null,
          city: city ?? null,
          state: state ?? null,
          zipCode: zipCode ?? null,
          country: country ?? null,
          acres: acres ?? null,
          establishedYear: establishedYear ?? null,
          website: website ?? null,
          businessRegistration: businessRegistration ?? null,
          taxId: taxId ?? null,
          phoneNumber: phoneNumber ?? null,
          email: email ?? null,
          isActive,
          createdAt: createdAt ?? null,
          updatedAt: updatedAt ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateFarm.replaceAll("__typename", ""),
            variables: {
              input: {
                id: farmRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "FarmUpdateForm")}
      {...rest}
    >
      <TextField
        label="Owner sub"
        isRequired={true}
        isReadOnly={false}
        value={ownerSub}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub: value,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.ownerSub ?? value;
          }
          if (errors.ownerSub?.hasError) {
            runValidationTasks("ownerSub", value);
          }
          setOwnerSub(value);
        }}
        onBlur={() => runValidationTasks("ownerSub", ownerSub)}
        errorMessage={errors.ownerSub?.errorMessage}
        hasError={errors.ownerSub?.hasError}
        {...getOverrideProps(overrides, "ownerSub")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name: value,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <SelectField
        label="Farm type"
        placeholder="Please select an option"
        isDisabled={false}
        value={farmType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType: value,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.farmType ?? value;
          }
          if (errors.farmType?.hasError) {
            runValidationTasks("farmType", value);
          }
          setFarmType(value);
        }}
        onBlur={() => runValidationTasks("farmType", farmType)}
        errorMessage={errors.farmType?.errorMessage}
        hasError={errors.farmType?.hasError}
        {...getOverrideProps(overrides, "farmType")}
      >
        <option
          children="Livestock"
          value="LIVESTOCK"
          {...getOverrideProps(overrides, "farmTypeoption0")}
        ></option>
        <option
          children="Crop"
          value="CROP"
          {...getOverrideProps(overrides, "farmTypeoption1")}
        ></option>
        <option
          children="Dairy"
          value="DAIRY"
          {...getOverrideProps(overrides, "farmTypeoption2")}
        ></option>
        <option
          children="Poultry"
          value="POULTRY"
          {...getOverrideProps(overrides, "farmTypeoption3")}
        ></option>
        <option
          children="Mixed"
          value="MIXED"
          {...getOverrideProps(overrides, "farmTypeoption4")}
        ></option>
        <option
          children="Aquaculture"
          value="AQUACULTURE"
          {...getOverrideProps(overrides, "farmTypeoption5")}
        ></option>
        <option
          children="Organic"
          value="ORGANIC"
          {...getOverrideProps(overrides, "farmTypeoption6")}
        ></option>
        <option
          children="Greenhouse"
          value="GREENHOUSE"
          {...getOverrideProps(overrides, "farmTypeoption7")}
        ></option>
        <option
          children="Orchard"
          value="ORCHARD"
          {...getOverrideProps(overrides, "farmTypeoption8")}
        ></option>
        <option
          children="Vineyard"
          value="VINEYARD"
          {...getOverrideProps(overrides, "farmTypeoption9")}
        ></option>
        <option
          children="Other"
          value="OTHER"
          {...getOverrideProps(overrides, "farmTypeoption10")}
        ></option>
      </SelectField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description: value,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        value={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address: value,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks("address", value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks("address", address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, "address")}
      ></TextField>
      <TextField
        label="City"
        isRequired={false}
        isReadOnly={false}
        value={city}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city: value,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.city ?? value;
          }
          if (errors.city?.hasError) {
            runValidationTasks("city", value);
          }
          setCity(value);
        }}
        onBlur={() => runValidationTasks("city", city)}
        errorMessage={errors.city?.errorMessage}
        hasError={errors.city?.hasError}
        {...getOverrideProps(overrides, "city")}
      ></TextField>
      <TextField
        label="State"
        isRequired={false}
        isReadOnly={false}
        value={state}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state: value,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.state ?? value;
          }
          if (errors.state?.hasError) {
            runValidationTasks("state", value);
          }
          setState(value);
        }}
        onBlur={() => runValidationTasks("state", state)}
        errorMessage={errors.state?.errorMessage}
        hasError={errors.state?.hasError}
        {...getOverrideProps(overrides, "state")}
      ></TextField>
      <TextField
        label="Zip code"
        isRequired={false}
        isReadOnly={false}
        value={zipCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode: value,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.zipCode ?? value;
          }
          if (errors.zipCode?.hasError) {
            runValidationTasks("zipCode", value);
          }
          setZipCode(value);
        }}
        onBlur={() => runValidationTasks("zipCode", zipCode)}
        errorMessage={errors.zipCode?.errorMessage}
        hasError={errors.zipCode?.hasError}
        {...getOverrideProps(overrides, "zipCode")}
      ></TextField>
      <TextField
        label="Country"
        isRequired={false}
        isReadOnly={false}
        value={country}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country: value,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.country ?? value;
          }
          if (errors.country?.hasError) {
            runValidationTasks("country", value);
          }
          setCountry(value);
        }}
        onBlur={() => runValidationTasks("country", country)}
        errorMessage={errors.country?.errorMessage}
        hasError={errors.country?.hasError}
        {...getOverrideProps(overrides, "country")}
      ></TextField>
      <TextField
        label="Acres"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={acres}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres: value,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.acres ?? value;
          }
          if (errors.acres?.hasError) {
            runValidationTasks("acres", value);
          }
          setAcres(value);
        }}
        onBlur={() => runValidationTasks("acres", acres)}
        errorMessage={errors.acres?.errorMessage}
        hasError={errors.acres?.hasError}
        {...getOverrideProps(overrides, "acres")}
      ></TextField>
      <TextField
        label="Established year"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={establishedYear}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear: value,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.establishedYear ?? value;
          }
          if (errors.establishedYear?.hasError) {
            runValidationTasks("establishedYear", value);
          }
          setEstablishedYear(value);
        }}
        onBlur={() => runValidationTasks("establishedYear", establishedYear)}
        errorMessage={errors.establishedYear?.errorMessage}
        hasError={errors.establishedYear?.hasError}
        {...getOverrideProps(overrides, "establishedYear")}
      ></TextField>
      <TextField
        label="Website"
        isRequired={false}
        isReadOnly={false}
        value={website}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website: value,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.website ?? value;
          }
          if (errors.website?.hasError) {
            runValidationTasks("website", value);
          }
          setWebsite(value);
        }}
        onBlur={() => runValidationTasks("website", website)}
        errorMessage={errors.website?.errorMessage}
        hasError={errors.website?.hasError}
        {...getOverrideProps(overrides, "website")}
      ></TextField>
      <TextField
        label="Business registration"
        isRequired={false}
        isReadOnly={false}
        value={businessRegistration}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration: value,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.businessRegistration ?? value;
          }
          if (errors.businessRegistration?.hasError) {
            runValidationTasks("businessRegistration", value);
          }
          setBusinessRegistration(value);
        }}
        onBlur={() =>
          runValidationTasks("businessRegistration", businessRegistration)
        }
        errorMessage={errors.businessRegistration?.errorMessage}
        hasError={errors.businessRegistration?.hasError}
        {...getOverrideProps(overrides, "businessRegistration")}
      ></TextField>
      <TextField
        label="Tax id"
        isRequired={false}
        isReadOnly={false}
        value={taxId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId: value,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.taxId ?? value;
          }
          if (errors.taxId?.hasError) {
            runValidationTasks("taxId", value);
          }
          setTaxId(value);
        }}
        onBlur={() => runValidationTasks("taxId", taxId)}
        errorMessage={errors.taxId?.errorMessage}
        hasError={errors.taxId?.hasError}
        {...getOverrideProps(overrides, "taxId")}
      ></TextField>
      <TextField
        label="Phone number"
        isRequired={false}
        isReadOnly={false}
        value={phoneNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber: value,
              email,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.phoneNumber ?? value;
          }
          if (errors.phoneNumber?.hasError) {
            runValidationTasks("phoneNumber", value);
          }
          setPhoneNumber(value);
        }}
        onBlur={() => runValidationTasks("phoneNumber", phoneNumber)}
        errorMessage={errors.phoneNumber?.errorMessage}
        hasError={errors.phoneNumber?.hasError}
        {...getOverrideProps(overrides, "phoneNumber")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email: value,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isActive}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive: value,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.isActive ?? value;
          }
          if (errors.isActive?.hasError) {
            runValidationTasks("isActive", value);
          }
          setIsActive(value);
        }}
        onBlur={() => runValidationTasks("isActive", isActive)}
        errorMessage={errors.isActive?.errorMessage}
        hasError={errors.isActive?.hasError}
        {...getOverrideProps(overrides, "isActive")}
      ></SwitchField>
      <TextField
        label="Created at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt: value,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <TextField
        label="Updated at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={updatedAt && convertToLocal(new Date(updatedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              ownerSub,
              name,
              farmType,
              description,
              address,
              city,
              state,
              zipCode,
              country,
              acres,
              establishedYear,
              website,
              businessRegistration,
              taxId,
              phoneNumber,
              email,
              isActive,
              createdAt,
              updatedAt: value,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || farmModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || farmModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}

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
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { ChickenFlock } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function ChickenFlockUpdateForm(props) {
  const {
    id: idProp,
    chickenFlock: chickenFlockModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    breed: "",
    count: "",
    hasRooster: false,
    notes: "",
  };
  const [breed, setBreed] = React.useState(initialValues.breed);
  const [count, setCount] = React.useState(initialValues.count);
  const [hasRooster, setHasRooster] = React.useState(initialValues.hasRooster);
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = chickenFlockRecord
      ? { ...initialValues, ...chickenFlockRecord }
      : initialValues;
    setBreed(cleanValues.breed);
    setCount(cleanValues.count);
    setHasRooster(cleanValues.hasRooster);
    setNotes(cleanValues.notes);
    setErrors({});
  };
  const [chickenFlockRecord, setChickenFlockRecord] = React.useState(
    chickenFlockModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(ChickenFlock, idProp)
        : chickenFlockModelProp;
      setChickenFlockRecord(record);
    };
    queryData();
  }, [idProp, chickenFlockModelProp]);
  React.useEffect(resetStateValues, [chickenFlockRecord]);
  const validations = {
    breed: [{ type: "Required" }],
    count: [{ type: "Required" }],
    hasRooster: [],
    notes: [],
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
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          breed,
          count,
          hasRooster,
          notes,
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
          await DataStore.save(
            ChickenFlock.copyOf(chickenFlockRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "ChickenFlockUpdateForm")}
      {...rest}
    >
      <TextField
        label="Breed"
        isRequired={true}
        isReadOnly={false}
        value={breed}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              breed: value,
              count,
              hasRooster,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.breed ?? value;
          }
          if (errors.breed?.hasError) {
            runValidationTasks("breed", value);
          }
          setBreed(value);
        }}
        onBlur={() => runValidationTasks("breed", breed)}
        errorMessage={errors.breed?.errorMessage}
        hasError={errors.breed?.hasError}
        {...getOverrideProps(overrides, "breed")}
      ></TextField>
      <TextField
        label="Count"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={count}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              breed,
              count: value,
              hasRooster,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.count ?? value;
          }
          if (errors.count?.hasError) {
            runValidationTasks("count", value);
          }
          setCount(value);
        }}
        onBlur={() => runValidationTasks("count", count)}
        errorMessage={errors.count?.errorMessage}
        hasError={errors.count?.hasError}
        {...getOverrideProps(overrides, "count")}
      ></TextField>
      <SwitchField
        label="Has rooster"
        defaultChecked={false}
        isDisabled={false}
        isChecked={hasRooster}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              breed,
              count,
              hasRooster: value,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.hasRooster ?? value;
          }
          if (errors.hasRooster?.hasError) {
            runValidationTasks("hasRooster", value);
          }
          setHasRooster(value);
        }}
        onBlur={() => runValidationTasks("hasRooster", hasRooster)}
        errorMessage={errors.hasRooster?.errorMessage}
        hasError={errors.hasRooster?.hasError}
        {...getOverrideProps(overrides, "hasRooster")}
      ></SwitchField>
      <TextField
        label="Notes"
        isRequired={false}
        isReadOnly={false}
        value={notes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              breed,
              count,
              hasRooster,
              notes: value,
            };
            const result = onChange(modelFields);
            value = result?.notes ?? value;
          }
          if (errors.notes?.hasError) {
            runValidationTasks("notes", value);
          }
          setNotes(value);
        }}
        onBlur={() => runValidationTasks("notes", notes)}
        errorMessage={errors.notes?.errorMessage}
        hasError={errors.notes?.hasError}
        {...getOverrideProps(overrides, "notes")}
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
          isDisabled={!(idProp || chickenFlockModelProp)}
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
              !(idProp || chickenFlockModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}

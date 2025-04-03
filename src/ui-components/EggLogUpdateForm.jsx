/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { EggLog } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function EggLogUpdateForm(props) {
  const {
    id: idProp,
    eggLog: eggLogModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    date: "",
    eggsCollected: "",
    chickenFlockID: "",
  };
  const [date, setDate] = React.useState(initialValues.date);
  const [eggsCollected, setEggsCollected] = React.useState(
    initialValues.eggsCollected
  );
  const [chickenFlockID, setChickenFlockID] = React.useState(
    initialValues.chickenFlockID
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = eggLogRecord
      ? { ...initialValues, ...eggLogRecord }
      : initialValues;
    setDate(cleanValues.date);
    setEggsCollected(cleanValues.eggsCollected);
    setChickenFlockID(cleanValues.chickenFlockID);
    setErrors({});
  };
  const [eggLogRecord, setEggLogRecord] = React.useState(eggLogModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(EggLog, idProp)
        : eggLogModelProp;
      setEggLogRecord(record);
    };
    queryData();
  }, [idProp, eggLogModelProp]);
  React.useEffect(resetStateValues, [eggLogRecord]);
  const validations = {
    date: [{ type: "Required" }],
    eggsCollected: [{ type: "Required" }],
    chickenFlockID: [{ type: "Required" }],
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
          date,
          eggsCollected,
          chickenFlockID,
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
            EggLog.copyOf(eggLogRecord, (updated) => {
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
      {...getOverrideProps(overrides, "EggLogUpdateForm")}
      {...rest}
    >
      <TextField
        label="Date"
        isRequired={true}
        isReadOnly={false}
        type="date"
        value={date}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date: value,
              eggsCollected,
              chickenFlockID,
            };
            const result = onChange(modelFields);
            value = result?.date ?? value;
          }
          if (errors.date?.hasError) {
            runValidationTasks("date", value);
          }
          setDate(value);
        }}
        onBlur={() => runValidationTasks("date", date)}
        errorMessage={errors.date?.errorMessage}
        hasError={errors.date?.hasError}
        {...getOverrideProps(overrides, "date")}
      ></TextField>
      <TextField
        label="Eggs collected"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={eggsCollected}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              date,
              eggsCollected: value,
              chickenFlockID,
            };
            const result = onChange(modelFields);
            value = result?.eggsCollected ?? value;
          }
          if (errors.eggsCollected?.hasError) {
            runValidationTasks("eggsCollected", value);
          }
          setEggsCollected(value);
        }}
        onBlur={() => runValidationTasks("eggsCollected", eggsCollected)}
        errorMessage={errors.eggsCollected?.errorMessage}
        hasError={errors.eggsCollected?.hasError}
        {...getOverrideProps(overrides, "eggsCollected")}
      ></TextField>
      <TextField
        label="Chicken flock id"
        isRequired={true}
        isReadOnly={false}
        value={chickenFlockID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              date,
              eggsCollected,
              chickenFlockID: value,
            };
            const result = onChange(modelFields);
            value = result?.chickenFlockID ?? value;
          }
          if (errors.chickenFlockID?.hasError) {
            runValidationTasks("chickenFlockID", value);
          }
          setChickenFlockID(value);
        }}
        onBlur={() => runValidationTasks("chickenFlockID", chickenFlockID)}
        errorMessage={errors.chickenFlockID?.errorMessage}
        hasError={errors.chickenFlockID?.hasError}
        {...getOverrideProps(overrides, "chickenFlockID")}
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
          isDisabled={!(idProp || eggLogModelProp)}
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
              !(idProp || eggLogModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}

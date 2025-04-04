/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { ChickenFlock } from "../models";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ChickenFlockUpdateFormInputValues = {
    breed?: string;
    count?: number;
    hasRooster?: boolean;
    notes?: string;
};
export declare type ChickenFlockUpdateFormValidationValues = {
    breed?: ValidationFunction<string>;
    count?: ValidationFunction<number>;
    hasRooster?: ValidationFunction<boolean>;
    notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ChickenFlockUpdateFormOverridesProps = {
    ChickenFlockUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    breed?: PrimitiveOverrideProps<TextFieldProps>;
    count?: PrimitiveOverrideProps<TextFieldProps>;
    hasRooster?: PrimitiveOverrideProps<SwitchFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ChickenFlockUpdateFormProps = React.PropsWithChildren<{
    overrides?: ChickenFlockUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    chickenFlock?: ChickenFlock;
    onSubmit?: (fields: ChickenFlockUpdateFormInputValues) => ChickenFlockUpdateFormInputValues;
    onSuccess?: (fields: ChickenFlockUpdateFormInputValues) => void;
    onError?: (fields: ChickenFlockUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ChickenFlockUpdateFormInputValues) => ChickenFlockUpdateFormInputValues;
    onValidate?: ChickenFlockUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ChickenFlockUpdateForm(props: ChickenFlockUpdateFormProps): React.ReactElement;

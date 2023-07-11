import React, { useContext } from 'react';
import {
  Table,
  DataTable,
  TableCell,
  TableRow,
  TableBody,
  BodyText,
  Heading,
  Tooltip,
  IconInfo,
  Disclaimer,
  Link,
  List,
  ListItem,
} from '@lmig/lmds-react';
import { format, parseISO } from 'date-fns';
import { PropertyClaim, PropertyLossCause } from '../../graphql/property-claim-response-types';
import { AutoClaim } from '../../graphql/auto-response-types';
import { BrandContext } from '@lmig/apptrove-ui-claims-common-util';
import './claim-details-accordion.scss';

export interface ClaimDetailsAccordionProps<T> {
  claim: T;
  handleShowDeductibleModal?: () => void;
}

export const ClaimDetailsAccordion = <T extends PropertyClaim | AutoClaim>({
  claim,
  handleShowDeductibleModal,
}: ClaimDetailsAccordionProps<T>) => {
  const isPropertyClaim = 'loss' in claim;

  const lossCause = isPropertyClaim ? claim.loss?.cause : claim.cause;
  const hasCustomizedDeductibleLink =
    lossCause && [(PropertyLossCause.Hail, PropertyLossCause.Wind)].includes(lossCause);

  const BrandConfig = useContext(BrandContext);

  return (
    <>
      <DataTable>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <BodyText type="default-medium">Claim Number</BodyText>
              </TableCell>
              <TableCell textAlign="right">
                <BodyText>{claim.claimNumber}</BodyText>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DataTable>
      <DataTable>
        <Heading type="h4-bold">Incident details</Heading>
        <Table>
          <TableBody>
            {!!claim.reportedDateET && (
              <TableRow>
                <TableCell>
                  <BodyText type="default-medium">Incident reported on*</BodyText>
                </TableCell>
                <TableCell textAlign="right">
                  <BodyText>{format(parseISO(claim.reportedDateET.slice(0, -1)), 'MMMM d, yyyy')}</BodyText>
                </TableCell>
              </TableRow>
            )}
            {!!claim.loss?.dateET && (
              <TableRow>
                <TableCell>
                  <BodyText type="default-medium">Date of Incident</BodyText>
                </TableCell>
                <TableCell textAlign="right">
                  <BodyText>{format(parseISO(claim.loss.dateET.slice(0, -1)), 'MMMM d, yyyy')}</BodyText>
                </TableCell>
              </TableRow>
            )}
            {!!lossCause && (
              <TableRow>
                <TableCell>
                  <BodyText type="default-medium">Type of Incident</BodyText>
                </TableCell>
                <TableCell textAlign="right">
                  <BodyText>{lossCause}</BodyText>
                </TableCell>
              </TableRow>
            )}
            {!!claim.loss?.address && (
              <TableRow>
                <TableCell>
                  <BodyText type="default-medium">Incident location</BodyText>
                </TableCell>
                <TableCell textAlign="right">
                  <BodyText>
                    <div>{claim.loss.address.streetAddress1}</div>
                    <div>{claim.loss.address.streetAddress2}</div>
                    <div>
                      {claim.loss.address.city}, {claim.loss.address.state} {claim.loss.address.zip}
                    </div>
                  </BodyText>
                </TableCell>
              </TableRow>
            )}
            {isPropertyClaim && claim.policyNumber && (
              <TableRow>
                <TableCell>
                  <BodyText type="default-medium">Policy Number</BodyText>
                </TableCell>
                <TableCell textAlign="right">
                  <BodyText>{claim.policyNumber}</BodyText>
                </TableCell>
              </TableRow>
            )}
            {isPropertyClaim && lossCause !== PropertyLossCause.HomeOwnerLiability && claim.claimDeductible && (
              <>
                <TableRow>
                  <TableCell>
                    <Tooltip content="The amount you pay out of pocket towards replacement/repair costs.">
                      <BodyText type="default-medium" tag="span">
                        General deductible
                        <IconInfo
                          size={{
                            base: '24',
                          }}
                        />
                      </BodyText>
                    </Tooltip>
                  </TableCell>
                  <TableCell textAlign="right">
                    <BodyText>${claim.claimDeductible}</BodyText>
                  </TableCell>
                </TableRow>
                {hasCustomizedDeductibleLink && (
                  <Link onClick={handleShowDeductibleModal} variant="standalone">
                    Customized deductible may apply
                  </Link>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </DataTable>
      {!isPropertyClaim && (
        <DataTable>
          <Heading type="h4-bold">Vehicle details</Heading>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <BodyText type="default-medium">Vehicle</BodyText>
                </TableCell>
                <TableCell textAlign="right">
                  <BodyText className="bodyText">
                    {claim.vehicle.year} {claim.vehicle.make} {claim.vehicle.model}
                  </BodyText>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <BodyText type="default-medium">Driver</BodyText>
                </TableCell>
                <TableCell textAlign="right">
                  <BodyText className="bodyText">{claim.vehicle.driver}</BodyText>
                </TableCell>
              </TableRow>
              {!!claim.vehicle.passengers?.length && (
                <TableRow>
                  <TableCell>
                    <BodyText type="default-medium">Passenger(s)</BodyText>
                  </TableCell>
                  <TableCell textAlign="right">
                    {claim.vehicle.passengers.map((passenger, index) => {
                      const key = index + passenger;
                      return (
                        <BodyText key={key} className="bodyText">
                          <p>{passenger}</p>
                        </BodyText>
                      );
                    })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DataTable>
      )}
      <BodyText type="default-medium" className="bodyTextMargin">
        What to expect
      </BodyText>
      <BodyText>
        In most cases, a Claims Representative will contact you within 1 business day from the date you reported the
        claim. Please note: It may take longer during times of severe weather.
      </BodyText>
      <BodyText type="default-medium" className="bodyTextMargin">
        Resources
      </BodyText>
      <BodyText>
        <List>
          <ListItem>
            <Link href={BrandConfig.homeInsuranceGuideLink} variant="standalone" caretPosition="none" target="_blank">
              Your guide to home insurance claims
            </Link>
          </ListItem>
          <ListItem>
            <Link href={BrandConfig.homeFAQLink} variant="standalone" caretPosition="none" target="_blank">
              Answers to the most common homeowner claims questions
            </Link>
          </ListItem>
        </List>
      </BodyText>
      <div className="claimDetailsSeparator">
        <Disclaimer>*All times and dates are displayed and adjusted for Eastern Time (ET).</Disclaimer>
      </div>
    </>
  );
};

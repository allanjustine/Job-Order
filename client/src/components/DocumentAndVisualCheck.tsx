import Input from "./ui/input";
import Label from "./ui/label";

export default function DocumentAndVisualCheck({
  documents,
  setDocuments,
  visualCheck,
  setVisualCheck,
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Documents */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-md font-semibold mb-3 text-blue-700">
          VEHICLE DOCUMENT/TOOLS
        </h3>
        <div className="space-y-2">
          <Label onCheck>
            <Input
              type="checkbox"
              checked={documents.ownerToolKit}
              onChange={(e) =>
                setDocuments({
                  ...documents,
                  ownerToolKit: e.target.checked,
                })
              }
            />
            Owner Tool Kit
          </Label>
          <Label onCheck>
            <Input
              type="checkbox"
              checked={documents.ownerManual}
              onChange={(e) =>
                setDocuments({
                  ...documents,
                  ownerManual: e.target.checked,
                })
              }
            />
            Owner Manual
          </Label>
          <Label onCheck>
            <Input
              type="checkbox"
              checked={documents.warrantyGuideBook}
              onChange={(e) =>
                setDocuments({
                  ...documents,
                  warrantyGuideBook: e.target.checked,
                })
              }
            />
            Warranty Guide Book
          </Label>
          <div className="flex items-center gap-2">
            <Label onCheck>
              <Input
                type="checkbox"
                checked={documents.others}
                onChange={(e) =>
                  setDocuments({
                    ...documents,
                    others: e.target.checked,
                  })
                }
              />
              Others
            </Label>
            {documents.others && (
              <Input
                type="text"
                value={documents.othersText}
                onChange={(e) =>
                  setDocuments({
                    ...documents,
                    othersText: e.target.value,
                  })
                }
                placeholder="Specify"
              />
            )}
          </div>
        </div>
      </div>

      {/* Visual Check */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-md font-semibold mb-3 text-blue-700">
          VEHICLE VISUAL CHECKING
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={visualCheck.dent}
              onChange={(e) =>
                setVisualCheck({
                  ...visualCheck,
                  dent: e.target.checked,
                })
              }
            />
            <span>Dent</span>
            {visualCheck.dent && (
              <Input
                type="text"
                placeholder="Location"
                value={visualCheck.dentNotes}
                onChange={(e) =>
                  setVisualCheck({
                    ...visualCheck,
                    dentNotes: e.target.value,
                  })
                }
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={visualCheck.scratch}
              onChange={(e) =>
                setVisualCheck({
                  ...visualCheck,
                  scratch: e.target.checked,
                })
              }
            />
            <span>Scratch</span>
            {visualCheck.scratch && (
              <Input
                type="text"
                placeholder="Location"
                value={visualCheck.scratchNotes}
                onChange={(e) =>
                  setVisualCheck({
                    ...visualCheck,
                    scratchNotes: e.target.value,
                  })
                }
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={visualCheck.broken}
              onChange={(e) =>
                setVisualCheck({
                  ...visualCheck,
                  broken: e.target.checked,
                })
              }
            />
            <span>Broken</span>
            {visualCheck.broken && (
              <Input
                type="text"
                placeholder="Location"
                value={visualCheck.brokenNotes}
                onChange={(e) =>
                  setVisualCheck({
                    ...visualCheck,
                    brokenNotes: e.target.value,
                  })
                }
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={visualCheck.missing}
              onChange={(e) =>
                setVisualCheck({
                  ...visualCheck,
                  missing: e.target.checked,
                })
              }
            />
            <span>Missing</span>
            {visualCheck.missing && (
              <Input
                type="text"
                placeholder="Location"
                value={visualCheck.missingNotes}
                onChange={(e) =>
                  setVisualCheck({
                    ...visualCheck,
                    missingNotes: e.target.value,
                  })
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
